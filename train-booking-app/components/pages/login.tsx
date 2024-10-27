// "use client";
// import * as Dialog from "@radix-ui/react-dialog";
// import { Cross2Icon } from "@radix-ui/react-icons";
// import LoginForm from "../LoginForm";

// export default function Login() {
//   return (
//     <Dialog.Root>
//       <Dialog.Trigger asChild>
//         <button
//           type="button"
//           className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
//         >
//           Login
//         </button>
//       </Dialog.Trigger>
//       <Dialog.Portal>
//         <Dialog.Overlay className="bg-black opacity-50 absolute top-0 w-full h-full z-10" />
//         <Dialog.Content
//           className={`fixed
// left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] 
// data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg`}
//         >
//           {/* Form */}
//           <LoginForm />
//           {/* Close Button */}
//           <Dialog.Close
//             asChild
//             className={`absolute right-4 top-4 rounded-sm opacity-70
//                ring-offset-background transition-opacity hover:opacity-100 
//                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
//                disabled:pointer-events-none data-[state=open]:bg-accent 
//                data-[state=open]:text-muted-foreground`}
//           >
//             <Cross2Icon className="h-4 w-4" />
//           </Dialog.Close>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }
