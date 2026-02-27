import { type ExecutionResult } from 'graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_URL_GQL } from '@contractspec/lib.gql-client-example-product';
import type {
  DocumentTypeDecoration,
  ResultOf,
  VariablesOf,
} from '@graphql-typed-document-node/core';

type TypedDocument = DocumentTypeDecoration<unknown, Record<string, unknown>>;

export const useGraphQL = <TDocument extends TypedDocument>(
  document: TDocument,
  ...[variables]: VariablesOf<TDocument> extends Record<string, never>
    ? []
    : [VariablesOf<TDocument>]
) => {
  return useQuery({
    queryKey: [
      document,
      // variables,
      // sessionData?.session?.token
      //   ? `authenticated-${sessionData.session.userId}`
      //   : 'unauthenticated',
    ] as const,
    refetchOnMount: true,
    queryFn: async ({ queryKey }): Promise<ResultOf<TDocument>> => {
      const fetchResponse = await fetch(API_URL_GQL, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          // ...(sessionData?.session?.token
          //   ? { Authorization: `Bearer ${sessionData.session.token}` }
          //   : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryKey[0].toString(),
          variables,
        }),
      });

      const gqlResponse = (await fetchResponse.json()) as ExecutionResult<
        ResultOf<TDocument>
      >;
      if (gqlResponse.errors) {
        throw new Error(
          gqlResponse.errors.map((error) => error.message).join(', ')
        );
      }
      return gqlResponse.data as ResultOf<TDocument>;
    },
    // throwOnError: (response) => {
    //   console.error('gql error', response);
    //   return true;
    // },
  });
};

export const useGraphQLMutation = <TDocument extends TypedDocument>(
  document: TDocument
) => {
  return useMutation({
    mutationKey: [document] as const,
    mutationFn: async (variables: VariablesOf<TDocument>) => {
      const response = await fetch(API_URL_GQL, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: document.toString(),
          variables,
        }),
      });

      const data = (await response.json()) as ExecutionResult<
        ResultOf<TDocument>
      >;
      if (data.errors) {
        throw new Error(data.errors.map((error) => error.message).join(', '));
      }
      return data.data as ResultOf<TDocument>;
    },
  });
};
