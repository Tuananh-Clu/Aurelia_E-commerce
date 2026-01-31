import { AuthPanel } from "./AuthPanel";
import { EditorialPanel } from "./EdithoralPanel";

export const FormAuthor = () => {

  return (
    <main className="flex h-full w-full mt-16">
      <EditorialPanel type="user"/>
      <AuthPanel  type="user"/>
    </main>
  );
};
