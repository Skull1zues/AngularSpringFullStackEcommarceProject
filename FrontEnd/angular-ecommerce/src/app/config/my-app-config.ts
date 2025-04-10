import { pkce } from "@okta/okta-auth-js";

export default {

    oidc: {
        clientId: 'smvT9GzI8njg1JNsaHulwptLu9rmp2e4',
        issuer: 'https://dev-e8vigvs7hi8lgvvj.us.auth0.com/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email'],
        pkce: true
    }

}
