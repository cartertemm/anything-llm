import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";
import { useEffect, useState } from "react";
import * as Skeleton from "react-loading-skeleton";
import AddMemberModal from "./AddMemberModal";
import WorkspaceMemberRow from "./WorkspaceMemberRow";

export default function Members({ workspace }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [adminWorkspace, setAdminWorkspace] = useState(null);

  const { isOpen, openModal, closeModal } = useModal();
  useEffect(() => {
    async function fetchData() {
      const _users = await Admin.users();
      const workspaceUsers = await Admin.workspaceUsers(workspace.id);
      const adminWorkspaces = await Admin.workspaces();
      setAdminWorkspace(
        adminWorkspaces.find(
          (adminWorkspace) => adminWorkspace.id === workspace.id
        )
      );
      setWorkspaceUsers(workspaceUsers);
      setUsers(_users);
      setLoading(false);
    }
    fetchData();
  }, [workspace]);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <div className="flex justify-between -mt-3">
      <table className="w-full max-w-[700px] text-sm text-left rounded-lg">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Date Added
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {workspaceUsers.length > 0 ? (
            workspaceUsers.map((user, index) => (
              <WorkspaceMemberRow key={index} user={user} />
            ))
          ) : (
            <tr>
              <td className="text-center py-4 text-white/80" colSpan="4">
                No workspace members
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={openModal}
        className="text-xs px-2 py-1 font-semibold rounded-lg bg-[#46C8FF] hover:bg-[#2C2F36] hover:text-white h-[34px] w-[100px] -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
      >
        Manage Users
      </button>

      <ModalWrapper isOpen={isOpen}>
        <AddMemberModal
          closeModal={closeModal}
          users={users}
          workspace={adminWorkspace}
        />
      </ModalWrapper>
    </div>
  );
}
