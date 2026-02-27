'use client';

import * as React from 'react';

import { Button } from '../../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { Drawer, DrawerContent, DrawerTrigger } from '../../drawer';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { getUiLocale } from '../../utils';
import { useMediaQuery } from '../../use-media-query';

interface Status {
  value: string;
  label: string;
}

const AUTOCOMPLETE_COPY = {
  en: {
    setStatus: '+ Set status',
    filterStatus: 'Filter status...',
    noResults: 'No results found.',
    statuses: {
      backlog: 'Backlog',
      inProgress: 'In Progress',
      done: 'Done',
      canceled: 'Canceled',
    },
  },
  fr: {
    setStatus: '+ Definir le statut',
    filterStatus: 'Filtrer les statuts...',
    noResults: 'Aucun resultat.',
    statuses: {
      backlog: 'Backlog',
      inProgress: 'En cours',
      done: 'Termine',
      canceled: 'Annule',
    },
  },
  es: {
    setStatus: '+ Definir estado',
    filterStatus: 'Filtrar estados...',
    noResults: 'No se encontraron resultados.',
    statuses: {
      backlog: 'Pendiente',
      inProgress: 'En progreso',
      done: 'Hecho',
      canceled: 'Cancelado',
    },
  },
} as const;

export function ComboBoxResponsive() {
  const locale = getUiLocale();
  const copy = AUTOCOMPLETE_COPY[locale];

  const statuses = React.useMemo<Status[]>(
    () => [
      {
        value: 'backlog',
        label: copy.statuses.backlog,
      },
      {
        value: 'in progress',
        label: copy.statuses.inProgress,
      },
      {
        value: 'done',
        label: copy.statuses.done,
      },
      {
        value: 'canceled',
        label: copy.statuses.canceled,
      },
    ],
    [copy]
  );

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedStatusValue, setSelectedStatusValue] = React.useState<
    string | null
  >(null);
  const selectedStatus = statuses.find(
    (status) => status.value === selectedStatusValue
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? (
              <>{selectedStatus.label}</>
            ) : (
              <>{copy.setStatus}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            statuses={statuses}
            setOpen={setOpen}
            setSelectedStatus={setSelectedStatusValue}
            filterStatusPlaceholder={copy.filterStatus}
            emptyLabel={copy.noResults}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>{copy.setStatus}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            statuses={statuses}
            setOpen={setOpen}
            setSelectedStatus={setSelectedStatusValue}
            filterStatusPlaceholder={copy.filterStatus}
            emptyLabel={copy.noResults}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  statuses,
  setOpen,
  setSelectedStatus,
  filterStatusPlaceholder,
  emptyLabel,
}: {
  statuses: Status[];
  setOpen: (open: boolean) => void;
  setSelectedStatus: (statusValue: string | null) => void;
  filterStatusPlaceholder: string;
  emptyLabel: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={filterStatusPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyLabel}</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(value || null);
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
