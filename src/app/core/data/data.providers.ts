import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FirestoreCookbookService } from './firestore-cookbook.service';
import { MockRecipeGenerator } from './mock/mock-recipe-generator';
import { MockCookbookService } from './mock/mock-cookbook.service';
import { N8nRecipeGenerator } from './n8n-recipe-generator';
import { RecipeGenerator } from './recipe-generator';
import { CookbookService } from './cookbook.service';

/**
 * Registers generator and cookbook, either real or mocked.
 * @param useMock - `true` to use mocks instead of n8n and Firestore.
 * @returns Providers for `app.config.ts`.
 */
export function provideRecipeData(useMock: boolean): EnvironmentProviders {
  return makeEnvironmentProviders(
    useMock
      ? [
          { provide: RecipeGenerator, useClass: MockRecipeGenerator },
          { provide: CookbookService, useExisting: MockCookbookService },
        ]
      : [
          { provide: RecipeGenerator, useClass: N8nRecipeGenerator },
          { provide: CookbookService, useClass: FirestoreCookbookService },
        ],
  );
}
