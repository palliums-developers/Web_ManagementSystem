declare let user_data_interface: {
    id?: Number,
    name: String,
    role: String,
    Email: String,
    phone?: String,
    add_time?: Number,
    status?: boolean
}
declare let status_interface: {
    status: boolean,
    name: String
}
export { user_data_interface, status_interface }
// export interface status_interface {
//     status: boolean,
//     name: String
// }