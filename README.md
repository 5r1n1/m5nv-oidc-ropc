# m5nv-oidc-ropc
Custom oidc-provider with ROPC grant implemented

## ROPC grant
The oidc-provider does not provide Resource Owner Password Credentials (ROPC) grant type, but allows customizing the provider engine using custom grant types. This wrapper uses a local customized version of the oidc-provider which allows the ROPC grant type and lets user login with userid and password.

Thsi is useful when we want to use the oidc-provider for a 2-legged authorization - i.e., the auth server and the resurce server are inside the same network and a token based resource usage is needed.
