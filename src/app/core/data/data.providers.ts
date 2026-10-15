import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { DatabaseCookbookService } from './database-cookbook.service';
import { MockRecipeGenerator } from './mock/mock-recipe-generator';
import { MockCookbookService } from './mock/mock-cookbook.service';
import { N8nRecipeGenerator } from './n8n-recipe-generator';
import { RecipeGenerator } from './recipe-generator';
import { CookbookService } from './cookbook.service';

export interface MockSettings {
  generator: boolean;
  cookbook: boolean;
}

/**
 * Registers generator and cookbook, each either real or mocked.
 * @param useMock - `generator` mocks n8n, `cookbook` mocks the Realtime Database.
 * @returns Providers for `app.config.ts`.
 */
export function provideRecipeData(useMock: MockSettings): EnvironmentProviders {
  return makeEnvironmentProviders([
    useMock.generator
      ? { provide: RecipeGenerator, useClass: MockRecipeGenerator }
      : { provide: RecipeGenerator, useClass: N8nRecipeGenerator },
    useMock.cookbook
      ? { provide: CookbookService, useExisting: MockCookbookService }
      : { provide: CookbookService, useClass: DatabaseCookbookService },
  ]);
}
