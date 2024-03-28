import { encrypt } from "../../utils/Password";

const appUsers = [
  {
    name: "Super Admin",
    email: "root@sudos.rw",
    phone: "0786910057",
    password: encrypt("Pa$$word"),
  },
];

export default appUsers;
