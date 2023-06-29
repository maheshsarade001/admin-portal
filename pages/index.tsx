import { useEffect, useState } from "react";
import Base from "../components/core/Base";
import TableLoading from "../components/skeleton/Table";
import { deleteUserApi, getAllUserApi } from "../service/user";
import useUserStore from "../store/user";
import { User } from "../types";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/core/Button";
import AddUser from "../components/AddUser";
import useDialogStore from "../store/dialog";
import toast from "react-hot-toast";
import EditUser from "../components/EditUser";
import WarningMsg from "../components/core/WarningMsg";
import Input from "../components/core/Input";
import { log } from "console";
const Home = () => {
  const [activeUser, setActiveUser] = useState<string>("");
  const { setAddUserOpen, setEditUserOpen, isEditUserOpen, setWarningOpen } =
    useDialogStore();
  const { setAllUser, users } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredUser, setFilteredUser] = useState(users);

  useEffect(() => {
    setLoading(true);
    getAllUser();
  }, []);

  useEffect(() => {
    setFilteredUser(users);
  }, [users]);
  // get All User
  const getAllUser = () => {
    getAllUserApi()
      .then((response) => {
        console.log(response.data.data, "ok");
        setLoading(false);

        setAllUser(response.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  // delete User by id
  const deleteBtnClick = (id: string) => {
    deleteUserApi(id).then((response) => {
      toast.success(response.data.message);
      setWarningOpen(false);
      getAllUser();
    });
  };

  const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const temp = users.filter((usr) =>
      usr.firstName.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredUser(temp);
  };

  return (
    <Base>
      <div className="p-5 ">
        <AddUser />
        {isEditUserOpen && <EditUser id={activeUser} />}
        <WarningMsg
          fn={() => {
            deleteBtnClick(activeUser);
          }}
          title="Are You Sure ?"
          msg="Are you sure you want to delete the user"
        />
        <div className="flex items-center justify-between my-2">
          <div className="w-1/3 flex items-center  rounded-md border-2 border-[#334154]">
            <MagnifyingGlassIcon className="w-6 ml-2" />
            <Input
              type="text"
              label="Search"
              name="Search"
              className="border-none"
              onChange={searchUser}
            />
          </div>
          <Button
            className="flex w-auto "
            onClick={() => {
              setAddUserOpen(true);
            }}
          >
            {" "}
            <PlusCircleIcon className="w-6 mr-2" />
            Add User
          </Button>
        </div>
        <div className=" overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className=" w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  First Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Last Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Phone Number
                </th>
                <th scope="col" className="py-3 px-6">
                  Age
                </th>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoading colLength={5} />
              ) : users.length == 0 ? (
                <tr>
                  <td className="text-center py-6 px-2" colSpan={5}>
                    No User Found
                  </td>
                </tr>
              ) : (
                filteredUser.map((data: User) => (
                  <tr
                    key={data._id}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td
                      scope="row"
                      className="py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.firstName}
                    </td>
                    <td className="py-4 px-6">{data.lastName}</td>
                    <td className="py-4 px-6">{data.phoneNumber}</td>

                    <td className="py-4 px-6">{data.age}</td>
                    <td className="py-4 px-6 flex">
                      <PencilSquareIcon
                        onClick={() => {
                          data._id && setActiveUser(data._id);
                          setEditUserOpen(true);
                        }}
                        className="w-6 mr-3 cursor-pointer text-blue-500"
                      />
                      <TrashIcon
                        onClick={() => {
                          data._id && setActiveUser(data._id);
                          setWarningOpen(true);
                        }}
                        className="w-6 cursor-pointer text-red-500"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Base>
  );
};

export default Home;
