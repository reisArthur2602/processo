"use client";

import { CnjNumber } from "@/components/shared/cnj-number";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabsExamples = () => (
  <div className="overflow-hidden rounded-card border border-line bg-white shadow-panel">
    <Tabs defaultValue="timeline">
      <div className="border-b border-line px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CnjNumber value="0008421-33.2025.8.19.0001" />
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">
              Ação de cobrança
            </h3>
          </div>
          <StatusBadge status="active" />
        </div>
        <TabsList>
          <TabsTrigger value="timeline" count={5}>
            Linha do tempo
          </TabsTrigger>
          <TabsTrigger value="documents" count={4}>
            Documentos
          </TabsTrigger>
          <TabsTrigger value="parties">Partes</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="timeline" className="px-5 pb-6 sm:px-6">
        <ol className="space-y-5">
          {[
            {
              date: "Hoje, 09:42",
              title: "Juntada de petição",
              desc: "Petição protocolada pela parte autora.",
            },
            {
              date: "28 jun., 14:20",
              title: "Despacho judicial",
              desc: "Juiz determinou prazo de 15 dias para manifestação.",
            },
            {
              date: "20 jun., 10:00",
              title: "Audiência realizada",
              desc: "Audiência de instrução e julgamento concluída.",
            },
          ].map((item) => (
            <li key={item.date} className="flex gap-4">
              <div className="relative mt-1 flex w-4 shrink-0 flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-docket ring-2 ring-white" />
                <span className="mt-1 flex-1 border-l border-docket/40" />
              </div>
              <div className="pb-2">
                <p className="font-mono text-[11px] font-semibold text-slate">
                  {item.date}
                </p>
                <p className="mt-0.5 font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm text-slate">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </TabsContent>

      <TabsContent value="documents" className="px-5 pb-6 sm:px-6">
        <ul className="divide-y divide-line">
          {[
            "Petição inicial",
            "Contestação da ré",
            "Laudo pericial",
            "Sentença de mérito",
          ].map((doc) => (
            <li
              key={doc}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="font-medium text-ink">{doc}</span>
              <span className="text-xs text-slate">PDF</span>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="parties" className="px-5 pb-6 sm:px-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-slate">
              Autor
            </dt>
            <dd className="mt-1 font-semibold text-ink">Marina Duarte</dd>
            <dd className="text-xs text-slate">CPF 123.456.789-00</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-slate">
              Réu
            </dt>
            <dd className="mt-1 font-semibold text-ink">
              Nova Aurora Serviços
            </dd>
            <dd className="text-xs text-slate">CNPJ 12.345.678/0001-90</dd>
          </div>
        </dl>
      </TabsContent>
    </Tabs>
  </div>
);

export { TabsExamples };
