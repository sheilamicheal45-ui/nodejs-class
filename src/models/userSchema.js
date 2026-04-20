
export const userShape = (data) => ({
    username: data.username || "",
    email: data.email,
    password: data.password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()

})