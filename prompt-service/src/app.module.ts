import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { PromptModule } from './modules/prompt/prompt.module';
import { TemplateModule } from './modules/template/template.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // Database - Supabase Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Always prioritize using the explicit DATABASE_URL in production to avoid DNS resolution issues
        const databaseUrl = configService.get('DATABASE_URL');
        const nodeEnv = configService.get('NODE_ENV');
        
        // In production, always use the DATABASE_URL with explicit IPv4 configuration
        if (databaseUrl) {
          console.log('Connecting using DATABASE_URL with IPv4 forced');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: false, // Never synchronize in production
            logging: false,
            ssl: true,
            extra: {
              // Force IPv4 connections
              family: 4,
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // Fallback to Supabase credentials if DATABASE_URL is not available
        const supabaseUrl = configService.get('SUPABASE_URL');
        const supabaseKey = configService.get('SUPABASE_SERVICE_KEY');
        const projectId = supabaseUrl?.match(/https:\/\/([^\.]+)\.supabase\.co/)?.[1];
        
        if (projectId && supabaseKey) {
          console.log('Connecting to Supabase database with IPv4 forced');
          return {
            type: 'postgres',
            host: `34.102.90.143`, // Use explicit IP instead of hostname
            port: 5432,
            username: 'postgres',
            password: supabaseKey,
            database: 'postgres',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: false,
            ssl: true,
            extra: {
              // Force IPv4 connections
              family: 4,
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // If running in development with no database config, use in-memory sqlite
        if (configService.get('NODE_ENV') !== 'production') {
          console.log('WARNING: No database configuration found. Using in-memory SQLite.');
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true,
            logging: true
          };
        }
        
        throw new Error('No database configuration found. Please provide SUPABASE_URL and SUPABASE_SERVICE_KEY or DATABASE_URL environment variables.');
      },
    }),
    
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    
    // Feature modules
    PromptModule,
    TemplateModule,
  ],
})
export class AppModule {}
