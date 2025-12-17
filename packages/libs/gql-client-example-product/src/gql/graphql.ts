/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  CountryCode: { input: any; output: any };
  Currency: { input: any; output: any };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  EmailAddress: { input: any; output: any };
  /** Unvalidated float scalar */
  Float_unsecure: { input: any; output: any };
  /** A GeoJSON object as defined by RFC 7946: https://datatracker.ietf.org/doc/html/rfc7946 */
  GeoJSON: {
    input:
      | {
          type: 'Point';
          coordinates: [number, number] | [number, number, number];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPoint';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'LineString';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiLineString';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Polygon';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPolygon';
          coordinates: [number, number] | [number, number, number][][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'GeometryCollection';
          geometries: (
            | {
                type: 'Point';
                coordinates: [number, number] | [number, number, number];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPoint';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'LineString';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiLineString';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'Polygon';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPolygon';
                coordinates: [number, number] | [number, number, number][][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
          )[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Feature';
          geometry:
            | (
                | {
                    type: 'Point';
                    coordinates: [number, number] | [number, number, number];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPoint';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'LineString';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiLineString';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'Polygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPolygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'GeometryCollection';
                    geometries: (
                      | {
                          type: 'Point';
                          coordinates:
                            | [number, number]
                            | [number, number, number];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPoint';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'LineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiLineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'Polygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPolygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                    )[];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
              )
            | null;
          properties: { [key: string]: any } | null;
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'FeatureCollection';
          features: {
            type: 'Feature';
            geometry:
              | (
                  | {
                      type: 'Point';
                      coordinates: [number, number] | [number, number, number];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPoint';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'LineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiLineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'Polygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPolygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'GeometryCollection';
                      geometries: (
                        | {
                            type: 'Point';
                            coordinates:
                              | [number, number]
                              | [number, number, number];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPoint';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'LineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiLineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'Polygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPolygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                      )[];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                )
              | null;
            properties: { [key: string]: any } | null;
            bbox?:
              | [number, number, number, number]
              | [number, number, number, number, number, number];
          }[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        };
    output:
      | {
          type: 'Point';
          coordinates: [number, number] | [number, number, number];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPoint';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'LineString';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiLineString';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Polygon';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPolygon';
          coordinates: [number, number] | [number, number, number][][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'GeometryCollection';
          geometries: (
            | {
                type: 'Point';
                coordinates: [number, number] | [number, number, number];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPoint';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'LineString';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiLineString';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'Polygon';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPolygon';
                coordinates: [number, number] | [number, number, number][][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
          )[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Feature';
          geometry:
            | (
                | {
                    type: 'Point';
                    coordinates: [number, number] | [number, number, number];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPoint';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'LineString';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiLineString';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'Polygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPolygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'GeometryCollection';
                    geometries: (
                      | {
                          type: 'Point';
                          coordinates:
                            | [number, number]
                            | [number, number, number];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPoint';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'LineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiLineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'Polygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPolygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                    )[];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
              )
            | null;
          properties: { [key: string]: any } | null;
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'FeatureCollection';
          features: {
            type: 'Feature';
            geometry:
              | (
                  | {
                      type: 'Point';
                      coordinates: [number, number] | [number, number, number];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPoint';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'LineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiLineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'Polygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPolygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'GeometryCollection';
                      geometries: (
                        | {
                            type: 'Point';
                            coordinates:
                              | [number, number]
                              | [number, number, number];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPoint';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'LineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiLineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'Polygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPolygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                      )[];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                )
              | null;
            properties: { [key: string]: any } | null;
            bbox?:
              | [number, number, number, number]
              | [number, number, number, number, number, number];
          }[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        };
  };
  /** Unvalidated integer scalar */
  Int_unsecure: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  Latitude: { input: any; output: any };
  Locale: { input: any; output: any };
  Longitude: { input: any; output: any };
  NonEmptyString: { input: any; output: any };
  PhoneNumber: { input: any; output: any };
  /** Unvalidated string scalar */
  String_unsecure: { input: any; output: any };
  Time: { input: any; output: any };
  TimeZone: { input: any; output: any };
  URL: { input: any; output: any };
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<
    DocumentTypeDecoration<TResult, TVariables>['__apiType']
  >;
  public __meta__?: Record<string, any> | undefined;
  private value: string;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}