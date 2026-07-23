const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;

export const createCategory = 
async (
  data: { name: string },
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/category/createCategory`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

export const getCategories =
  async (token: string) => {
    const response = await fetch(
      `${BACKEND_PORT}/category/listCateogry`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  };

export const getCategoryById =
  async (
    id: string,
    token: string
  ) => {
    const response =
      await fetch(
        `${BACKEND_PORT}/category/getCategoryById?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.json();
  };

export const updateCategory =
  async (
    data: any,
    token: string
  ) => {
    console.log(data)
    const response =
      await fetch(
        `${BACKEND_PORT}/category/updateCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

    return response.json();
  };

export const deleteCategory = 
async (
  id: string,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_PORT}/category/deleteCategory`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
      }),
    }
  );

  return response.json();
};