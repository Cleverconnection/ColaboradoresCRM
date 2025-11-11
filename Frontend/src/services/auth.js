import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "2d7bcc44-8337-42ec-a3e2-6ba7c9bda91f",
    authority: "https://login.microsoftonline.com/4f8dcb98-4f69-455b-bc94-a1c9a3982409",
    redirectUri: window.location.origin, // 👈 garante autoajuste local/online
  },
};


export const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite.All"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
