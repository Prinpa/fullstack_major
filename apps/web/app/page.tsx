import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { AppLayout } from "../components/Layout/AppLayout";


export default function Home() {
  return (
   <>
   <AppLayout>
     <div>THIS IS THE PAGE CONTENT</div>
   </AppLayout>
   </>
  );
}
