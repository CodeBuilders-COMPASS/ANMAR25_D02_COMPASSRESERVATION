import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'; // Importe o tipo de erro específico

@Catch()
export class HandlerException implements ExceptionFilter {
  private readonly logger = new Logger(HandlerException.name);

  catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let errorDetails: any = null;
      let prismaErrorCode: string | null = null;


      this.logError(exception, request);

      if (exception instanceof HttpException) {
          ({ status, message } = this.handleHttpException(exception));
      } else if (exception instanceof PrismaClientKnownRequestError) { 
          ({ status, message } = this.handlePrismaKnownError(exception));
          prismaErrorCode = exception.code;
          errorDetails = this.getPrismaErrorDetails(exception);
      } else if (exception instanceof PrismaClientUnknownRequestError) { 
          message = 'Database request error';
          errorDetails = { clientVersion: exception['clientVersion'] }; 
      } else if (exception instanceof PrismaClientValidationError) { 
          status = HttpStatus.BAD_REQUEST;
          message = 'Database validation failed';
      } else if (exception instanceof Error) {
          message = exception.message;
          errorDetails = {
              name: exception.name,
              stack: process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
          };
      }

      const errorResponse = this.buildErrorResponse({
          status,
          message,
          request,
          prismaErrorCode: prismaErrorCode ?? undefined,
          errorDetails,
      });

      response.status(status).json(errorResponse);
  }

  private logError(exception: unknown, request: Request) {
      this.logger.error(
          `Exception occurred: ${exception instanceof Error ? exception.stack : exception}`,
      );
      this.logger.debug(`Request details: ${JSON.stringify({
          method: request.method,
          url: request.url,
          body: request.body,
          params: request.params,
      })}`);
  }

  private handleHttpException(exception: HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return {
          status,
          message: typeof response === 'object'
              ? (response as any).message || 'HTTP error occurred'
              : response.toString(),
          errorDetails: typeof response === 'object' ? response : null,
      };
  }

  private handlePrismaKnownError(error: PrismaClientKnownRequestError) { 
      const errorMapping = {
          P2000: { status: HttpStatus.BAD_REQUEST, message: 'Invalid data format' },
          P2002: { status: HttpStatus.CONFLICT, message: 'Unique constraint failed' },
          P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
      };

      return errorMapping[error.code] || {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database operation failed',
      };
  }

  private getPrismaErrorDetails(error: PrismaClientKnownRequestError) { 
      return {
          code: error.code,
          meta: error.meta,
          ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
      };
  }

  private buildErrorResponse({
      status,
      message,
      request,
      prismaErrorCode,
      errorDetails,
  }: {
      status: number;
      message: string;
      request: Request;
      prismaErrorCode?: string;
      errorDetails?: any;
  }) {
      const baseResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
      };

      if (prismaErrorCode) {
          baseResponse['errorCode'] = prismaErrorCode;
      }

      if (errorDetails && process.env.NODE_ENV !== 'production') {
          baseResponse['details'] = errorDetails;
      }

      return baseResponse;
  }
}
