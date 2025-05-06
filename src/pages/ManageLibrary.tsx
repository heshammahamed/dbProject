
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddBookForm from "@/components/AddBookForm";
import EditBooksTab from "@/components/EditBooksTab";
import MembersTab from "@/components/MembersTab";
import BorrowedBooksTab from "@/components/BorrowedBooksTab";
import ReservedBooksTab from "@/components/ReservedBooksTab";

const ManageLibrary = () => {
  const [activeTab, setActiveTab] = useState("add-book");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Library Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="add-book">Add Book</TabsTrigger>
          <TabsTrigger value="edit-books">Edit Books</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add-book" className="py-6">
          <AddBookForm />
        </TabsContent>
        
        <TabsContent value="edit-books" className="py-6">
          <EditBooksTab />
        </TabsContent>
        
        <TabsContent value="members" className="py-6">
          <MembersTab />
        </TabsContent>
        
        <TabsContent value="borrowed" className="py-6">
          <BorrowedBooksTab />
        </TabsContent>
        
        <TabsContent value="reserved" className="py-6">
          <ReservedBooksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageLibrary;
