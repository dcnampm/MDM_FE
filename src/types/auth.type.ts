export interface ConfirmResetPasswordForm {
  uuid: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IntrospectTokenResponse {
  exp?: number;
  iat?: number;
  jti?: string;
  iss?: string;
  aud?: string[];
  sub?: string;
  typ?: string;
  azp?: string;
  session_state?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email_verified?: boolean;
  acr?: string;
  'allowed-origins'?: string[];
  realm_access?: {
    roles?: string[];
  };
  resource_access?: {
    [key: string]: {
      roles?: string[];
    };
  };
  scope?: string;
  sid?: string;
  client_id?: string;
  username?: string;
  active: boolean;
}

export interface IntrospectTokenRequest {
  token: string;
  client_id: string;
  client_secret: string;
}