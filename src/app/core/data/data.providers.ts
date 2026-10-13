import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FirestoreRecipeRepository } from './firestore-recipe-repository';
import { MockRecipeGenerator } from './mock/mock-recipe-generator';
import { MockRecipeRepository } from './mock/mock-recipe-repository';
import { N8nRecipeGenerator } from './n8n-recipe-generator';
import { RecipeGenerator } from './recipe-generator';
import { RecipeRepository } from './recipe-repository';

/**
 * Registers the recipe data layer.
 *
 * @param useMock - `true` to use in-memory mocks instead of n8n and Firestore.
 * @returns Environment providers for `app.config.ts`.
 */
export function provideRecipeData(useMock: boolean): EnvironmentProviders {
  return makeEnvironmentProviders(
    useMock
      ? [
          { provide: RecipeGenerator, useClass: MockRecipeGenerator },
          { provide: RecipeRepository, useExisting: MockRecipeRepository },
        ]
      : [
          { provide: RecipeGenerator, useClass: N8nRecipeGenerator },
          { provide: RecipeRepository, useClass: FirestoreRecipeRepository },
        ],
  );
}
