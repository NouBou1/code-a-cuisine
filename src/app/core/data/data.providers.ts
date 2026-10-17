import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CookbookService } from './cookbook.service';
import { DatabaseCookbookService } from './database-cookbook.service';
import { N8nRecipeGenerator } from './n8n-recipe-generator';
import { RecipeGenerator } from './recipe-generator';

/**
 * Registers the n8n generator and the Realtime Database cookbook.
 * @returns Providers for `app.config.ts`.
 */
export function provideRecipeData(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: RecipeGenerator, useClass: N8nRecipeGenerator },
    { provide: CookbookService, useClass: DatabaseCookbookService },
  ]);
}
