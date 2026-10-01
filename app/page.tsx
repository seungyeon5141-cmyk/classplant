"use client";

import { Camera, Leaf, Plus, Sprout, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const observations = [
  { date: "5월 20일", title: "새잎이 두 장 더 나왔어요", weather: "맑음", color: "bg-[#dff3d8]" },
  { date: "5월 15일", title: "줄기가 조금 더 굵어졌어요", weather: "흐림", color: "bg-[#fff0c7]" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbf4] text-[#183322]">
      <header className="border-b border-[#dfe9d9] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#2f6d45] text-white"><Sprout size={22} /></span>
            <div><p className="font-bold tracking-[-0.03em]">우리 반 식물 관찰일지</p><p className="text-xs text-[#65806c]">햇살초 6학년 2반 · 민지</p></div>
          </div>
          <Button className="rounded-full bg-[#2f6d45] px-5 hover:bg-[#25593a]"><Plus /> 관찰 기록</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[28px] bg-[#173f2a] p-5 text-white lg:min-h-[calc(100vh-125px)]">
          <p className="text-sm text-white/65">내 식물</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">방울토마토</h1>
          <div className="my-8 grid h-40 place-items-center rounded-[24px] bg-[#dff3d8] text-[#2f6d45]">
            <Leaf size={78} strokeWidth={1.5} />
          </div>
          <div className="space-y-5 text-sm">
            <div><div className="mb-2 flex justify-between"><span>기른 지 24일째</span><span>48%</span></div><Progress value={48} className="h-2 bg-white/15" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/10 p-3"><Sun className="mb-3 text-[#ffd35a]" size={20}/><span className="text-white/60">환경</span><p className="font-semibold">교실 창가</p></div>
              <div className="rounded-2xl bg-white/10 p-3"><Users className="mb-3 text-[#aee08f]" size={20}/><span className="text-white/60">기르는 사람</span><p className="font-semibold">김민지</p></div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="text-sm font-semibold text-[#5e7a66]">나의 성장 기록</p><h2 className="mt-1 text-3xl font-black tracking-[-0.05em]">오늘은 어떤 모습인가요?</h2></div>
            <span className="hidden rounded-full bg-[#fff0c7] px-4 py-2 text-sm font-semibold text-[#765b11] sm:inline">최근 기록 5일 전</span>
          </div>

          <Tabs defaultValue="during" className="w-full">
            <TabsList className="mb-5 grid h-auto w-full grid-cols-3 rounded-2xl bg-[#e9f1e5] p-1">
              <TabsTrigger value="before" className="rounded-xl py-3 text-base">키우기 전</TabsTrigger>
              <TabsTrigger value="during" className="rounded-xl py-3 text-base">키우는 중</TabsTrigger>
              <TabsTrigger value="after" className="rounded-xl py-3 text-base">키운 후</TabsTrigger>
            </TabsList>
            <TabsContent value="before"><Card><CardContent className="p-6">준비물과 환경, 나의 다짐을 기록해요.</CardContent></Card></TabsContent>
            <TabsContent value="during" className="space-y-4">
              <button className="group grid w-full gap-4 rounded-[26px] border-2 border-dashed border-[#aac9a8] bg-white p-5 text-left transition hover:border-[#2f6d45] sm:grid-cols-[170px_1fr]">
                <span className="grid min-h-32 place-items-center rounded-2xl bg-[#eef6e9] text-[#2f6d45]"><Camera size={38}/></span>
                <span className="flex flex-col justify-center"><strong className="text-xl">오늘의 모습을 남겨요</strong><span className="mt-2 text-[#66806d]">사진을 찍고, 달라진 점을 관찰해 보세요.</span><span className="mt-4 font-bold text-[#2f6d45]">새 관찰 기록 쓰기</span></span>
              </button>
              <div className="grid gap-4 sm:grid-cols-2">
                {observations.map((item) => <Card key={item.date} className="overflow-hidden border-[#dfe9d9] shadow-none"><div className={`h-28 ${item.color} grid place-items-center`}><Sprout size={48} className="text-[#2f6d45]"/></div><CardContent className="p-5"><div className="flex justify-between text-sm text-[#6a806f]"><span>{item.date}</span><span>{item.weather}</span></div><p className="mt-2 font-bold">{item.title}</p></CardContent></Card>)}
              </div>
            </TabsContent>
            <TabsContent value="after"><Card><CardContent className="p-6">수확한 식물의 활용 방법과 느낀 점을 정리해요.</CardContent></Card></TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
