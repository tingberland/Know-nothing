import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
export default function NotFound(){return <main><PublicHeader/><section className="error-page page-shell"><div className="error-code">404</div><h1>Lost in the archive.</h1><p>หน้าที่คุณตามหาอาจถูกย้าย ซ่อน หรือยังไม่เคยถูกเขียนขึ้นมา</p><Link className="nav-pill" href="/">กลับไปหน้าแรก ↙</Link></section></main>}
