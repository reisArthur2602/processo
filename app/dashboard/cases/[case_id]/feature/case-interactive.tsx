'use client';

import { CnjNumber } from '@/components/shared/cnj-number';
import { type Status, StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    type AddMovementInput,
    addMovementSchema,
    MOVEMENT_TYPES,
} from '@/schema/add-movement-schema';
import { type UpdateMovementInput, updateMovementSchema } from '@/schema/update-movement-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AlertCircle,
    Clock,
    Copy,
    Download,
    FilePlus,
    FileText,
    Pencil,
    Plus,
    Trash2,
    TriangleAlert,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addMovement } from '../actions/add-movement';
import { deleteDocument } from '../actions/delete-document';
import { deleteMovement } from '../actions/delete-movement';
import { updateMovement } from '../actions/update-movement';
import { UploadDocumentDialog } from './upload-document-dialog';

export type MovementRow = {
    id: string;
    title: string;
    movementType: string;
    description: string | null;
    occurredAt: string;
    createdByName: string;
};

export type DocumentRow = {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    createdAt: string;
};

type PartyData = { name: string; document: string | null } | null;

const STATUS_MAP: Record<string, Status> = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    ARCHIVED: 'archived',
};

const MOVEMENT_TYPE_BADGE: Record<string, string> = {
    Petição: 'bg-navy-soft text-navy h-fit',
    Prazo: 'bg-warning-soft text-warning h-fit',
    Audiência: 'bg-success-soft text-success h-fit',
    Decisão: 'bg-navy-soft text-navy h-fit',
    Documento: 'bg-mist text-slate h-fit',
    'Registro interno': 'bg-mist text-slate',
};

const toLocalISO = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatMovementDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const time = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    ) {
        return `Hoje · ${time}`;
    }
    const shortDate = date
        .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        .replace('.', '');
    return `${shortDate} · ${time}`;
};

const getLastUpdateLabel = (movements: MovementRow[]) => {
    if (!movements[0]) return 'Sem atualizações registradas';
    const date = new Date(movements[0].occurredAt);
    const now = new Date();
    const time = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    ) {
        return `Atualizado hoje às ${time}`;
    }
    const shortDate = date
        .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        .replace('.', '');
    return `Atualizado em ${shortDate}`;
};

const getDocIconClass = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'bg-danger-soft text-danger';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
        return 'bg-navy-soft text-navy';
    return 'bg-mist text-slate';
};

interface CaseInteractiveProps {
    caseId: string;
    caseStatus: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
    caseNumber: string;
    actionType: string;
    plaintiffParty: PartyData;
    defendantParty: PartyData;
    court: string;
    division: string | null;
    claimValue: string | null;
    nextDeadline: {
        title: string;
        dueAt: string;
        description: string | null;
    } | null;
    initialMovements: MovementRow[];
    documents: DocumentRow[];
    copyText: string;
}

const CaseInteractive = ({
    caseId,
    caseStatus,
    caseNumber,
    actionType,
    plaintiffParty,
    defendantParty,
    court,
    division,
    claimValue,
    nextDeadline,
    initialMovements,
    documents,
    copyText,
}: CaseInteractiveProps) => {
    const [movementDialogOpen, setMovementDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState<MovementRow | null>(null);
    const [movementPendingEdit, setMovementPendingEdit] = useState<MovementRow | null>(null);
    const [movementPendingDelete, setMovementPendingDelete] = useState<MovementRow | null>(null);
    const [deletingMovement, setDeletingMovement] = useState(false);
    const [activeTab, setActiveTab] = useState<'timeline' | 'documents'>('timeline');
    const [docPendingDelete, setDocPendingDelete] = useState<DocumentRow | null>(null);
    const [deletingDoc, setDeletingDoc] = useState(false);

    // ── Add movement form ──
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddMovementInput>({
        resolver: zodResolver(addMovementSchema),
        defaultValues: {
            title: '',
            movementType: 'Petição',
            occurredAt: toLocalISO(new Date()),
            description: '',
        },
    });

    // ── Edit movement form ──
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
    } = useForm<UpdateMovementInput>({
        resolver: zodResolver(updateMovementSchema),
    });

    useEffect(() => {
        if (movementPendingEdit) {
            resetEdit({
                title: movementPendingEdit.title,
                movementType:
                    movementPendingEdit.movementType as UpdateMovementInput['movementType'],
                occurredAt: toLocalISO(new Date(movementPendingEdit.occurredAt)),
                description: movementPendingEdit.description ?? '',
            });
        }
    }, [movementPendingEdit, resetEdit]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyText);
            toast.success('Informações do processo copiadas.');
        } catch {
            toast.error('Não foi possível copiar os dados.');
        }
    };

    const handleCloseMovementDialog = () => {
        setMovementDialogOpen(false);
        reset({
            title: '',
            movementType: 'Petição',
            occurredAt: toLocalISO(new Date()),
            description: '',
        });
    };

    const handleDeleteDocument = async () => {
        if (!docPendingDelete) return;
        setDeletingDoc(true);
        const result = await deleteDocument(caseId, docPendingDelete.id);
        setDeletingDoc(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message);
        setDocPendingDelete(null);
    };

    const handleDeleteMovement = async () => {
        if (!movementPendingDelete) return;
        setDeletingMovement(true);
        const result = await deleteMovement(caseId, movementPendingDelete.id);
        setDeletingMovement(false);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message);
        setMovementPendingDelete(null);
    };

    const onSubmit = async (data: AddMovementInput) => {
        const result = await addMovement(caseId, data);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success('Movimentação adicionada à linha do tempo.');
        handleCloseMovementDialog();
    };

    const onSubmitEdit = async (data: UpdateMovementInput) => {
        if (!movementPendingEdit) return;
        const result = await updateMovement(caseId, movementPendingEdit.id, data);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message);
        setMovementPendingEdit(null);
    };

    const parties =
        plaintiffParty && defendantParty
            ? `${plaintiffParty.name} contra ${defendantParty.name}.`
            : null;

    const daysUntilDeadline = nextDeadline
        ? Math.ceil((new Date(nextDeadline.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <>
            {/* ── Hero ── */}
            <section className="mb-8">
                <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status={STATUS_MAP[caseStatus]} />
                            <CnjNumber value={caseNumber} />
                        </div>
                        <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                            {actionType}
                        </h1>
                        {parties && <p className="mt-3 text-sm text-slate">{parties}</p>}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                        <Button
                            variant="secondary"
                            onClick={() =>
                                window.open(
                                    `/dashboard/cases/${caseId}/report`,
                                    '_blank',
                                    'noopener,noreferrer'
                                )
                            }
                        >
                            <FileText className="h-4 w-4" />
                            Gerar relatório PDF
                        </Button>
                        <Button variant="outline" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                            Copiar dados
                        </Button>
                        <Button onClick={() => setMovementDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Adicionar movimentação
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Two-column body ── */}
            <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                {/* Sidebar */}
                <aside className="space-y-5 xl:sticky xl:top-28">
                    {/* Case data card */}
                    <section
                        className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
                        aria-labelledby="case-data-title"
                    >
                        <div className="border-b border-line bg-ink px-6 py-5 text-white">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                                Resumo do processo
                            </p>
                            <h2
                                id="case-data-title"
                                className="mt-1 font-display text-2xl font-bold"
                            >
                                Dados dos autos
                            </h2>
                        </div>
                        <dl className="divide-y divide-line px-6">
                            <div className="py-5">
                                <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                    Autor
                                </dt>
                                <dd className="mt-2 font-semibold">
                                    {plaintiffParty?.name ?? '—'}
                                </dd>
                                {plaintiffParty?.document && (
                                    <dd className="mt-1 text-xs text-slate">
                                        {plaintiffParty.document}
                                    </dd>
                                )}
                            </div>
                            <div className="py-5">
                                <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                    Réu
                                </dt>
                                <dd className="mt-2 font-semibold">
                                    {defendantParty?.name ?? '—'}
                                </dd>
                                {defendantParty?.document && (
                                    <dd className="mt-1 text-xs text-slate">
                                        {defendantParty.document}
                                    </dd>
                                )}
                            </div>
                            <div className="py-5">
                                <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                    Tribunal e vara
                                </dt>
                                <dd className="mt-2 font-semibold">{court}</dd>
                                {division && (
                                    <dd className="mt-1 text-sm leading-5 text-slate">
                                        {division}
                                    </dd>
                                )}
                            </div>
                            {claimValue && (
                                <div className="py-5">
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                        Valor da causa
                                    </dt>
                                    <dd className="mt-2 font-display text-2xl font-bold">
                                        {claimValue}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </section>

                    {/* Deadline card */}
                    {nextDeadline ? (
                        <section
                            className="rounded-card border border-warning/25 bg-warning-soft p-5"
                            aria-labelledby="deadline-title"
                        >
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-warning">
                                    <Clock className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-warning">
                                        Próximo prazo
                                    </p>
                                    <h2 id="deadline-title" className="mt-1 font-semibold">
                                        {nextDeadline.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate">
                                        {daysUntilDeadline === 0
                                            ? 'Vence hoje'
                                            : daysUntilDeadline !== null && daysUntilDeadline < 0
                                              ? `Venceu há ${Math.abs(daysUntilDeadline)} dia(s)`
                                              : `Vence em ${daysUntilDeadline} dias`}{' '}
                                        · {new Date(nextDeadline.dueAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="rounded-card border border-line bg-white p-5 shadow-panel">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist text-slate">
                                    <Clock className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate">
                                        Próximo prazo
                                    </p>
                                    <p className="mt-1 text-sm text-slate">
                                        Nenhum prazo pendente.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </aside>

                {/* Activity section */}
                <section
                    className="min-w-0 overflow-hidden rounded-card border border-line bg-white shadow-panel"
                    aria-labelledby="history-title"
                >
                    <div className="border-b border-line px-5 pt-5 sm:px-6 sm:pt-6">
                        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">
                                    Histórico do caso
                                </p>
                                <h2
                                    id="history-title"
                                    className="mt-2 font-display text-3xl font-bold"
                                >
                                    Atividade processual
                                </h2>
                            </div>
                            <p className="text-xs text-slate">
                                {getLastUpdateLabel(initialMovements)}
                            </p>
                        </div>

                        {/* Tab buttons */}
                        <div
                            className="flex gap-1 overflow-x-auto"
                            role="tablist"
                            aria-label="Conteúdo do processo"
                        >
                            {(['timeline', 'documents'] as const).map((tab) => {
                                const label = tab === 'timeline' ? 'Linha do tempo' : 'Documentos';
                                const count =
                                    tab === 'timeline' ? initialMovements.length : documents.length;
                                const active = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        role="tab"
                                        id={`tab-${tab}`}
                                        aria-selected={active}
                                        aria-controls={`panel-${tab}`}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy',
                                            active
                                                ? 'border-navy text-navy'
                                                : 'border-transparent text-slate hover:text-ink'
                                        )}
                                    >
                                        {label}{' '}
                                        <span
                                            className={cn(
                                                'ml-1 rounded-full px-2 py-0.5 text-[10px]',
                                                active ? 'bg-navy-soft' : 'bg-mist'
                                            )}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeline panel */}
                    {activeTab === 'timeline' && (
                        <div
                            id="panel-timeline"
                            role="tabpanel"
                            aria-labelledby="tab-timeline"
                            className="p-5 sm:p-7"
                        >
                            {initialMovements.length === 0 ? (
                                <div className="py-12 text-center">
                                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-line" />
                                    <p className="text-sm font-medium text-slate">
                                        Nenhuma movimentação registrada.
                                    </p>
                                    <p className="mt-1 text-xs text-slate/70">
                                        Use o botão acima para adicionar a primeira.
                                    </p>
                                </div>
                            ) : (
                                <ol className="relative ml-2 border-l-2 border-docket/50">
                                    {initialMovements.map((movement, index) => (
                                        <li
                                            key={movement.id}
                                            className={cn(
                                                'relative pl-8',
                                                index < initialMovements.length - 1 && 'pb-9'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'absolute -left-[7px] top-1 h-3 w-3 rounded-full',
                                                    index === 0
                                                        ? 'bg-docket ring-4 ring-white'
                                                        : 'bg-white ring-2 ring-docket'
                                                )}
                                            />
                                            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                                <div>
                                                    <p
                                                        className={cn(
                                                            'text-xs font-bold uppercase tracking-[0.12em]',
                                                            index === 0 ? 'text-navy' : 'text-slate'
                                                        )}
                                                    >
                                                        {formatMovementDate(movement.occurredAt)}
                                                    </p>
                                                    <h3 className="mt-2 font-semibold">
                                                        {movement.title}
                                                    </h3>
                                                </div>
                                                <span
                                                    className={cn(
                                                        'w-fit rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                                                        MOVEMENT_TYPE_BADGE[
                                                            movement.movementType
                                                        ] ?? 'bg-mist text-slate'
                                                    )}
                                                >
                                                    {movement.movementType}
                                                </span>
                                            </div>
                                            {movement.description && (
                                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
                                                    {movement.description}
                                                </p>
                                            )}
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedMovement(movement)}
                                                    className="text-xs font-semibold text-navy hover:text-ink focus:outline-none focus-visible:underline"
                                                >
                                                    Ver detalhes →
                                                </button>
                                                <span className="text-line" aria-hidden="true">
                                                    ·
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setMovementPendingEdit(movement)}
                                                    aria-label="Editar movimentação"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                                                >
                                                    <Pencil
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMovementPendingDelete(movement)
                                                    }
                                                    aria-label="Excluir movimentação"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-danger hover:bg-danger-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                                                >
                                                    <Trash2
                                                        className="h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    )}

                    {/* Documents panel */}
                    {activeTab === 'documents' && (
                        <div
                            id="panel-documents"
                            role="tabpanel"
                            aria-labelledby="tab-documents"
                            className="p-5 sm:p-7"
                        >
                            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <p className="text-sm text-slate">
                                    Documentos anexados ao dossiê interno do processo.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUploadDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    Anexar documento
                                </Button>
                            </div>

                            {documents.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FilePlus className="mx-auto mb-3 h-8 w-8 text-line" />
                                    <p className="text-sm font-medium text-slate">
                                        Nenhum documento anexado.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {documents.map((doc) => (
                                        <article
                                            key={doc.id}
                                            className="flex flex-col justify-between gap-4 rounded-xl border border-line p-4 transition hover:border-navy/30 hover:bg-navy-soft/30 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex min-w-0 items-center gap-4">
                                                <span
                                                    className={cn(
                                                        'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
                                                        getDocIconClass(doc.mimeType)
                                                    )}
                                                >
                                                    <FileText
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold">
                                                        {doc.name}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate">
                                                        {formatFileSize(doc.size)} ·{' '}
                                                        {new Date(doc.createdAt).toLocaleDateString(
                                                            'pt-BR'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/dashboard/cases/${caseId}/documents/${doc.id}`}
                                                    download={doc.originalName}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-navy hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                                                >
                                                    <Download
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    Baixar
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setDocPendingDelete(doc)}
                                                    aria-label={`Excluir ${doc.name}`}
                                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-danger hover:bg-danger-soft hover:border-danger/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                                                >
                                                    <Trash2
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* ── Add movement dialog ── */}
            <Dialog open={movementDialogOpen} onOpenChange={handleCloseMovementDialog}>
                <DialogContent className="max-w-2xl overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
                    <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                                Novo andamento
                            </p>
                            <DialogTitle className="mt-1">Adicionar movimentação</DialogTitle>
                            <DialogDescription className="mt-1">
                                Registre um evento importante na linha do tempo deste processo.
                            </DialogDescription>
                        </div>
                        <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                            <X className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Fechar</span>
                        </DialogClose>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="space-y-5 px-6 py-6"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field className="sm:col-span-2">
                                <FieldLabel>Título da movimentação</FieldLabel>
                                <Input
                                    {...register('title')}
                                    placeholder="Ex.: Juntada de manifestação"
                                    status={errors.title ? 'error' : 'default'}
                                />
                                <FieldError>{errors.title?.message}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Tipo</FieldLabel>
                                <Select
                                    {...register('movementType')}
                                    status={errors.movementType ? 'error' : 'default'}
                                >
                                    {MOVEMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Select>
                                <FieldError>{errors.movementType?.message}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Data do evento</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    {...register('occurredAt')}
                                    status={errors.occurredAt ? 'error' : 'default'}
                                />
                                <FieldError>{errors.occurredAt?.message}</FieldError>
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel>Descrição</FieldLabel>
                                <Textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="Descreva o que aconteceu neste andamento."
                                    status={errors.description ? 'error' : 'default'}
                                />
                                <FieldError>{errors.description?.message}</FieldError>
                            </Field>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseMovementDialog}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" loading={isSubmitting}>
                                <Plus className="h-4 w-4" />
                                Salvar movimentação
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Edit movement dialog ── */}
            <Dialog
                open={!!movementPendingEdit}
                onOpenChange={(open) => !open && setMovementPendingEdit(null)}
            >
                <DialogContent className="max-w-2xl overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
                    <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                                Editar andamento
                            </p>
                            <DialogTitle className="mt-1">Editar movimentação</DialogTitle>
                            <DialogDescription className="mt-1">
                                Altere os dados do registro na linha do tempo.
                            </DialogDescription>
                        </div>
                        <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                            <X className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Fechar</span>
                        </DialogClose>
                    </div>

                    <form
                        onSubmit={handleSubmitEdit(onSubmitEdit)}
                        noValidate
                        className="space-y-5 px-6 py-6"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field className="sm:col-span-2">
                                <FieldLabel>Título da movimentação</FieldLabel>
                                <Input
                                    {...registerEdit('title')}
                                    placeholder="Ex.: Juntada de manifestação"
                                    status={editErrors.title ? 'error' : 'default'}
                                />
                                <FieldError>{editErrors.title?.message}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Tipo</FieldLabel>
                                <Select
                                    {...registerEdit('movementType')}
                                    status={editErrors.movementType ? 'error' : 'default'}
                                >
                                    {MOVEMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Select>
                                <FieldError>{editErrors.movementType?.message}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel>Data do evento</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    {...registerEdit('occurredAt')}
                                    status={editErrors.occurredAt ? 'error' : 'default'}
                                />
                                <FieldError>{editErrors.occurredAt?.message}</FieldError>
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel>Descrição</FieldLabel>
                                <Textarea
                                    {...registerEdit('description')}
                                    rows={4}
                                    placeholder="Descreva o que aconteceu neste andamento."
                                    status={editErrors.description ? 'error' : 'default'}
                                />
                                <FieldError>{editErrors.description?.message}</FieldError>
                            </Field>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMovementPendingEdit(null)}
                                disabled={isEditSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" loading={isEditSubmitting}>
                                Salvar alterações
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Movement detail dialog ── */}
            <Dialog open={!!selectedMovement} onOpenChange={() => setSelectedMovement(null)}>
                <DialogContent className="max-w-lg overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
                    <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                                Linha do tempo
                            </p>
                            <DialogTitle className="mt-1">{selectedMovement?.title}</DialogTitle>
                        </div>
                        <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                            <X className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Fechar</span>
                        </DialogClose>
                    </div>

                    {selectedMovement && (
                        <>
                            <dl className="divide-y divide-line px-6 py-2">
                                <div className="py-4">
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                        Tipo
                                    </dt>
                                    <dd className="mt-2">
                                        <span
                                            className={cn(
                                                'rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                                                MOVEMENT_TYPE_BADGE[
                                                    selectedMovement.movementType
                                                ] ?? 'bg-mist text-slate'
                                            )}
                                        >
                                            {selectedMovement.movementType}
                                        </span>
                                    </dd>
                                </div>
                                <div className="py-4">
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                        Data
                                    </dt>
                                    <dd className="mt-2 text-sm">
                                        {formatMovementDate(selectedMovement.occurredAt)}
                                    </dd>
                                </div>
                                <div className="py-4">
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                        Registrado por
                                    </dt>
                                    <dd className="mt-2 text-sm font-semibold">
                                        {selectedMovement.createdByName}
                                    </dd>
                                </div>
                                {selectedMovement.description && (
                                    <div className="py-4">
                                        <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                                            Descrição
                                        </dt>
                                        <dd className="mt-2 text-sm leading-6 text-slate">
                                            {selectedMovement.description}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                            <div className="flex gap-3 border-t border-line bg-mist/60 px-6 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMovementPendingEdit(selectedMovement);
                                        setSelectedMovement(null);
                                    }}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Editar
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        setMovementPendingDelete(selectedMovement);
                                        setSelectedMovement(null);
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Excluir
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Delete movement confirmation ── */}
            <Dialog
                open={!!movementPendingDelete}
                onOpenChange={(open) => !open && setMovementPendingDelete(null)}
            >
                <DialogContent>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
                        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <DialogTitle className="mt-4">Excluir movimentação?</DialogTitle>
                    <DialogDescription className="mt-2">
                        Esta ação não pode ser desfeita. O registro{' '}
                        <strong className="font-semibold text-ink">
                            {movementPendingDelete?.title}
                        </strong>{' '}
                        será permanentemente removido da linha do tempo.
                    </DialogDescription>
                    <DialogFooter className="mt-6 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setMovementPendingDelete(null)}
                            disabled={deletingMovement}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteMovement}
                            loading={deletingMovement}
                        >
                            Confirmar exclusão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Upload document dialog ── */}
            <UploadDocumentDialog
                caseId={caseId}
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
            />

            {/* ── Delete document confirmation ── */}
            <Dialog
                open={!!docPendingDelete}
                onOpenChange={(open) => !open && setDocPendingDelete(null)}
            >
                <DialogContent>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
                        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <DialogTitle className="mt-4">Excluir documento?</DialogTitle>
                    <DialogDescription className="mt-2">
                        Esta ação não pode ser desfeita. O arquivo{' '}
                        <strong className="font-semibold text-ink">{docPendingDelete?.name}</strong>{' '}
                        será permanentemente removido do processo.
                    </DialogDescription>
                    <DialogFooter className="mt-6 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDocPendingDelete(null)}
                            disabled={deletingDoc}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteDocument}
                            loading={deletingDoc}
                        >
                            Confirmar exclusão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { CaseInteractive };
