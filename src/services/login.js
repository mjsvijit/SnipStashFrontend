import axiosWrapper from "@/axios/axios-wrapper";

function loginUser(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosWrapper.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`, payload
        );
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  }
  function registerUser(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosWrapper.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, payload
        );
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  }
export { loginUser, registerUser };
