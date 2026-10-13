import { Routes } from '@angular/router';
import { hasIngredientsGuard, hasResultsGuard } from './core/guards/generator.guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Code à Cuisine',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'generate',
    title: 'Generate recipe | Code à Cuisine',
    loadComponent: () =>
      import('./features/generator/ingredients-step/ingredients-step').then(
        (m) => m.IngredientsStep,
      ),
  },
  {
    path: 'generate/preferences',
    title: 'Preferences | Code à Cuisine',
    canActivate: [hasIngredientsGuard],
    loadComponent: () =>
      import('./features/generator/preferences-step/preferences-step').then(
        (m) => m.PreferencesStep,
      ),
  },
  {
    path: 'generate/results',
    title: 'Recipe results | Code à Cuisine',
    canActivate: [hasResultsGuard],
    loadComponent: () => import('./features/generator/results/results').then((m) => m.Results),
  },
  {
    path: 'recipe/:id',
    title: 'Recipe | Code à Cuisine',
    loadComponent: () =>
      import('./features/recipe/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
  },
  {
    path: 'cookbook',
    title: 'Cookbook | Code à Cuisine',
    loadComponent: () => import('./features/cookbook/cookbook/cookbook').then((m) => m.Cookbook),
  },
  {
    path: 'cookbook/:cuisine',
    title: 'Cuisine | Code à Cuisine',
    loadComponent: () =>
      import('./features/cookbook/cuisine-recipes/cuisine-recipes').then((m) => m.CuisineRecipes),
  },
  { path: '**', redirectTo: '' },
];
