export const generateToken = async () => {
    try {
      const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}:${process.env.PAYPAL_SECRET_KEY!}`)}`,
        },
        body: "grant_type=client_credentials",
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  