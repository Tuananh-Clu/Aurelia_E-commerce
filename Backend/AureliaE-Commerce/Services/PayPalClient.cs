using PayPalCheckoutSdk.Core;

public static class PayPalClient
{
    public static PayPalHttpClient Client()
    {
        var clientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID");
        var secret = Environment.GetEnvironmentVariable("PAYPAL_SECRET");

        var environment = new SandboxEnvironment(clientId, secret);
        return new PayPalHttpClient(environment);
    }
}