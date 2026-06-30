"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";

const ControlsExamples = () => {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="grid gap-8 rounded-card border border-line bg-white p-6 shadow-panel sm:grid-cols-3 sm:p-8">
      {/* Checkbox */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Checkbox
        </p>
        <div className="space-y-3">
          <label
            htmlFor="cb-normal"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <Checkbox id="cb-normal" />
            Normal
          </label>
          <label
            htmlFor="cb-checked"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <Checkbox id="cb-checked" defaultChecked />
            Selecionado
          </label>
          <label
            htmlFor="cb-disabled"
            className="flex cursor-pointer items-center gap-3 text-sm text-slate/60"
          >
            <Checkbox id="cb-disabled" disabled />
            Desabilitado
          </label>
          <label
            htmlFor="cb-disabled-checked"
            className="flex cursor-pointer items-center gap-3 text-sm text-slate/60"
          >
            <Checkbox id="cb-disabled-checked" disabled defaultChecked />
            Desabilitado selecionado
          </label>
          <label
            htmlFor="cb-controlled"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <Checkbox
              id="cb-controlled"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            Controlado: {checked ? "marcado" : "desmarcado"}
          </label>
        </div>
      </div>

      {/* Radio */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Radio
        </p>
        <RadioGroup>
          <label
            htmlFor="radio-active"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <RadioGroupItem
              id="radio-active"
              name="status-demo"
              value="active"
              defaultChecked
            />
            Ativo
          </label>
          <label
            htmlFor="radio-suspended"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <RadioGroupItem
              id="radio-suspended"
              name="status-demo"
              value="suspended"
            />
            Suspenso
          </label>
          <label
            htmlFor="radio-archived"
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <RadioGroupItem
              id="radio-archived"
              name="status-demo"
              value="archived"
            />
            Arquivado
          </label>
          <label
            htmlFor="radio-disabled"
            className="flex cursor-pointer items-center gap-3 text-sm text-slate/60"
          >
            <RadioGroupItem
              id="radio-disabled"
              name="status-demo2"
              value="disabled"
              disabled
            />
            Desabilitado
          </label>
        </RadioGroup>
      </div>

      {/* Switch — usa div pois Switch é um <button>, não um <input> */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Switch
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Switch aria-label="Normal" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Switch defaultChecked aria-label="Ativado" />
            <span>Ativado</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate/60">
            <Switch disabled aria-label="Desabilitado" />
            <span>Desabilitado</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Switch
              checked={switchOn}
              onCheckedChange={setSwitchOn}
              aria-label="Controlado"
            />
            <span>Controlado: {switchOn ? "ativo" : "inativo"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ControlsExamples };
