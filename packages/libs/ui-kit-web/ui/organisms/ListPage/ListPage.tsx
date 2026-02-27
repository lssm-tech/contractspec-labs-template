import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Loader2, Plus, RefreshCcw } from 'lucide-react';
import { Button } from '../../button';
import { Card, CardContent } from '../../card';
import { VStack, HStack } from '../../stack';
import { Separator } from '../../separator';
import { SearchAndFilter } from '../../molecules/SearchAndFilter';
import { Pagination } from '../../atoms/Pagination';
import { getUiLocale } from '../../utils';
import type { ListPageProps } from './types';

const LIST_PAGE_COPY = {
  loadingTitle: {
    en: 'Loading...',
    fr: 'Chargement...',
    es: 'Cargando...',
  },
  loadingDescription: {
    en: 'Fetching data',
    fr: 'Recuperation des donnees en cours',
    es: 'Recuperando datos',
  },
  loadErrorTitle: {
    en: 'Loading error',
    fr: 'Erreur de chargement',
    es: 'Error de carga',
  },
  loadErrorFallback: {
    en: 'Something went wrong',
    fr: 'Une erreur est survenue',
    es: 'Ocurrio un error',
  },
  retry: {
    en: 'Retry',
    fr: 'Reessayer',
    es: 'Reintentar',
  },
  refreshing: {
    en: 'Updating...',
    fr: 'Mise a jour...',
    es: 'Actualizando...',
  },
  refresh: {
    en: 'Refresh',
    fr: 'Rafraichir',
    es: 'Actualizar',
  },
  new: {
    en: 'New',
    fr: 'Nouveau',
    es: 'Nuevo',
  },
  emptyTitle: {
    en: 'No items found',
    fr: 'Aucun element trouve',
    es: 'No se encontraron elementos',
  },
  emptyWithFilters: {
    en: 'Try changing your search criteria',
    fr: 'Essayez de modifier vos criteres de recherche',
    es: 'Prueba a cambiar tus criterios de busqueda',
  },
  emptyWithoutFilters: {
    en: 'Create your first item to get started',
    fr: 'Commencez par creer votre premier element',
    es: 'Comienza creando tu primer elemento',
  },
} as const;

export function ListPage<T>({
  title,
  description,
  header,
  items,
  totalItems,
  totalPages,
  isLoading,
  isFetching,
  error,
  listState,
  searchPlaceholder,
  filters = [],
  onRefresh,
  primaryAction,
  toolbar,
  renderItem,
  renderEmpty,
  renderStats,
  className = '',
  itemClassName = '',
}: ListPageProps<T>) {
  const locale = getUiLocale();
  const {
    searchQuery,
    setSearchQuery,
    filters: filterValues,
    setFilter,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = listState;

  // Loading state with no items
  if (isLoading && !items.length) {
    return (
      <VStack className={`space-y-4 md:space-y-6 ${className}`}>
        {header ? (
          header
        ) : (
          <VStack className="gap-1">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-base">{description}</p>
            )}
          </VStack>
        )}

        <div className="flex min-h-[400px] items-center justify-center">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <div>
                <h3 className="font-medium">
                  {LIST_PAGE_COPY.loadingTitle[locale]}
                </h3>
                <p className="text-muted-foreground text-base">
                  {LIST_PAGE_COPY.loadingDescription[locale]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </VStack>
    );
  }

  // Error state with no items
  if (error && !items.length) {
    return (
      <VStack className={`space-y-4 md:space-y-6 ${className}`}>
        {header ? (
          header
        ) : (
          <VStack className="gap-1">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-base">{description}</p>
            )}
          </VStack>
        )}

        <div className="flex min-h-[400px] items-center justify-center">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <AlertTriangle className="text-destructive h-12 w-12" />
              <div>
                <h3 className="font-medium">
                  {LIST_PAGE_COPY.loadErrorTitle[locale]}
                </h3>
                <p className="text-muted-foreground text-base">
                  {error.message || LIST_PAGE_COPY.loadErrorFallback[locale]}
                </p>
              </div>
              {onRefresh && (
                <Button onClick={onRefresh} variant="outline" size="sm">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {LIST_PAGE_COPY.retry[locale]}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </VStack>
    );
  }

  // Prepare filter configurations
  const filterConfigs = filters.map((filter) => ({
    key: filter.key,
    label: filter.label,
    value: filterValues[filter.key] || '',
    options: filter.options,
    onChange: (value: string) => {
      setFilter(filter.key, value === 'all' ? '' : value);
    },
    showCounts: filter.showCounts,
  }));

  return (
    <VStack className={`space-y-4 md:space-y-6 ${className}`}>
      {/* Header */}
      {header ? (
        header
      ) : (
        <HStack className="items-center justify-between">
          <VStack className="gap-1">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-base">{description}</p>
            )}
          </VStack>

          <HStack className="items-center gap-4">
            {toolbar}
            {(isLoading || isFetching) && (
              <div className="text-muted-foreground flex items-center gap-2 text-base">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">
                  {LIST_PAGE_COPY.refreshing[locale]}
                </span>
              </div>
            )}

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={Boolean(isLoading)}
                aria-label={LIST_PAGE_COPY.refresh[locale]}
              >
                <RefreshCcw
                  className={`mr-2 h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">
                  {LIST_PAGE_COPY.refresh[locale]}
                </span>
              </Button>
            )}

            {primaryAction && (
              <>
                {primaryAction.href ? (
                  <Link href={primaryAction.href}>
                    <Button>
                      {primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
                      <span className="hidden sm:inline">
                        {primaryAction.label}
                      </span>
                      <span className="sm:hidden">
                        {LIST_PAGE_COPY.new[locale]}
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={primaryAction.onClick}>
                    {primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
                    <span className="hidden sm:inline">
                      {primaryAction.label}
                    </span>
                    <span className="sm:hidden">
                      {LIST_PAGE_COPY.new[locale]}
                    </span>
                  </Button>
                )}
              </>
            )}
          </HStack>
        </HStack>
      )}

      {/* Stats (optional) */}
      {renderStats && (
        <>
          {renderStats(items)}
          <Separator />
        </>
      )}

      {/* Search and Filters */}
      <SearchAndFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
        filters={filterConfigs}
        isLoading={isLoading}
      />

      {/* Content */}
      {items.length === 0 && !isLoading ? (
        renderEmpty ? (
          renderEmpty()
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <div className="bg-muted-foreground/20 h-6 w-6 rounded-full" />
              </div>
              <div>
                <h3 className="font-medium">
                  {LIST_PAGE_COPY.emptyTitle[locale]}
                </h3>
                <p className="text-muted-foreground text-base">
                  {searchQuery || Object.values(filterValues).some((v) => v)
                    ? LIST_PAGE_COPY.emptyWithFilters[locale]
                    : LIST_PAGE_COPY.emptyWithoutFilters[locale]}
                </p>
              </div>
              {primaryAction &&
                !searchQuery &&
                !Object.values(filterValues).some((v) => v) && (
                  <>
                    {primaryAction.href ? (
                      <Link href={primaryAction.href}>
                        <Button>
                          {primaryAction.icon || (
                            <Plus className="mr-2 h-4 w-4" />
                          )}
                          {primaryAction.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button onClick={primaryAction.onClick}>
                        {primaryAction.icon || (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {primaryAction.label}
                      </Button>
                    )}
                  </>
                )}
            </CardContent>
          </Card>
        )
      ) : (
        <>
          {/* Items List */}
          <div className={`space-y-4 ${itemClassName}`}>
            {items.map((item, index) => renderItem(item, index))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              disabled={isLoading}
            />
          )}
        </>
      )}
    </VStack>
  );
}
