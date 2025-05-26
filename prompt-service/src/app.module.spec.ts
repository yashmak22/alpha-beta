import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

// Force test environment for SQLite usage
process.env.NODE_ENV = 'test';

describe('AppModule', () => {
  jest.setTimeout(30000); // Increase timeout for this specific test suite

  it('should compile the module', async () => {
    // Create the testing module
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Get the module instance
    const app = moduleRef.createNestApplication();
    await app.init();
    
    expect(moduleRef).toBeDefined();
    expect(app).toBeDefined();
    
    // Clean up
    await app.close();
  });
});
