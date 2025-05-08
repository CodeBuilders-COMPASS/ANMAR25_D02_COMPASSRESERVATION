import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly databaseUrl: string;

  constructor() {
    const isTestEnvironment = PrismaService.checkTestEnvironment();
    const databaseUrl = PrismaService.getDatabaseUrl(isTestEnvironment);

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: isTestEnvironment ? ['error'] : ['query', 'info', 'warn', 'error'],
    });

    this.databaseUrl = databaseUrl;
    PrismaService.logDatabaseConnection(databaseUrl);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static checkTestEnvironment(): boolean {
    return (
      process.env.NODE_ENV === 'test' ||
      process.env.JEST_WORKER_ID !== undefined
    );
  }

  private static getDatabaseUrl(isTestEnvironment: boolean): string {
    const url = isTestEnvironment
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL;

    if (!url) {
      throw new Error(
        `Database URL not configured for ${
          isTestEnvironment ? 'test' : 'development'
        } environment`,
      );
    }

    return url;
  }

  private static logDatabaseConnection(url: string) {
    console.log(
      `[PrismaService] Connecting to database: ${PrismaService.maskPassword(url)}`,
    );
  }

  private static maskPassword(url: string): string {
    return url.replace(/:\/\/[^:]+:[^@]+@/, '://****:****@');
  }
}