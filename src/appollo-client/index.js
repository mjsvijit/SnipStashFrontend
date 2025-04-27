const { GraphQLClient } = require("graphql-request");
let token=""
if (typeof window !== "undefined") {
     token = localStorage.getItem("token"); // replace with your actual key
   
  }
export const client = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL + "/graphql");

