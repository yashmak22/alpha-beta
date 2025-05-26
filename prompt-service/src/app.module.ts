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
        // Get Supabase connection details
        const supabaseUrl = configService.get('SUPABASE_URL');
        const supabaseKey = configService.get('SUPABASE_SERVICE_KEY');
        
        // Extract the database credentials from the Supabase URL
        // Format: https://[project_id].supabase.co
        const projectId = supabaseUrl?.match(/https:\/\/([^\.]+)\.supabase\.co/)?.[1];
        
        // Fallback to DATABASE_URL if provided
        const databaseUrl = configService.get('DATABASE_URL');
        
        // Use direct Supabase database connection if credentials are available
        if (projectId && supabaseKey) {
          console.log('Connecting to Supabase database');
          return {
            type: 'postgres',
            host: `db.${projectId}.supabase.co`,
            port: 5432,
            username: 'postgres',
            password: supabaseKey,
            database: 'postgres',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: false, // Disable auto-sync for production
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // Fallback to DATABASE_URL if Supabase details are not available
        if (databaseUrl) {
          console.log('Connecting using DATABASE_URL');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: configService.get('NODE_ENV') !== 'production',
            logging: configService.get('NODE_ENV') === 'development',
            ssl: configService.get('NODE_ENV') === 'production',
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
