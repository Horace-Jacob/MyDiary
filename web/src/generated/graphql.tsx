import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Admin = {
  __typename?: 'Admin';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type AdminResponse = {
  __typename?: 'AdminResponse';
  admin?: Maybe<Admin>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  login: AdminResponse;
  logout: Scalars['Boolean'];
  register: AdminResponse;
};


export type MutationCreatePostArgs = {
  text: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  secret: Scalars['String'];
};


export type MutationRegisterArgs = {
  fields: UserInputFields;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<Admin>;
};

export type UserInputFields = {
  email: Scalars['String'];
  password: Scalars['String'];
  secret: Scalars['String'];
  username: Scalars['String'];
};

export type AdminResponseSnippetFragment = { __typename?: 'AdminResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, admin?: { __typename?: 'Admin', id: number, username: string } | null };

export type AdminSnippetFragment = { __typename?: 'Admin', id: number, username: string };

export type ErrorSnippetFragment = { __typename?: 'FieldError', field: string, message: string };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  secret: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AdminResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, admin?: { __typename?: 'Admin', id: number, username: string } | null } };

export type CreatePostMutationVariables = Exact<{
  text: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, text: string, createdAt: string, updatedAt: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Admin', id: number, username: string } | null };

export const ErrorSnippetFragmentDoc = gql`
    fragment ErrorSnippet on FieldError {
  field
  message
}
    `;
export const AdminSnippetFragmentDoc = gql`
    fragment AdminSnippet on Admin {
  id
  username
}
    `;
export const AdminResponseSnippetFragmentDoc = gql`
    fragment AdminResponseSnippet on AdminResponse {
  errors {
    ...ErrorSnippet
  }
  admin {
    ...AdminSnippet
  }
}
    ${ErrorSnippetFragmentDoc}
${AdminSnippetFragmentDoc}`;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!, $secret: String!) {
  login(email: $email, password: $password, secret: $secret) {
    ...AdminResponseSnippet
  }
}
    ${AdminResponseSnippetFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($text: String!) {
  createPost(text: $text) {
    id
    text
    createdAt
    updatedAt
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...AdminSnippet
  }
}
    ${AdminSnippetFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};