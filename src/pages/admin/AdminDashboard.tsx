import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Star,
  Trash2,
  TrendingUp,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import Artwork from '../../components/Artwork';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import Modal from '../../components/ui/Modal';
import RatingStars from '../../components/ui/RatingStars';
import { Switch } from '../../components/ui/Switch';
import { useAdmin } from '../../context/AdminContext';
import { productCategories } from '../../data/products';
import { settings, waLink } from '../../data/settings';
import {
  classNames,
  formatDate,
  formatINR,
  timeAgo,
  uid,
} from '../../utils/format';
import type {
  AppointmentStatus,
  GalleryItem,
  Product,
  Service,
  Tone,
} from '../../types';

type Tab =
  | 'overview'
  | 'products'
  | 'services'
  | 'gallery'
  | 'appointments'
  | 'messages'
  | 'reviews'
  | 'settings';

const NAV: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const TONE_OPTIONS: Tone[] = [
  'graphite',
  'azure',
  'amber',
  'copper',
  'emerald',
  'violet',
  'ruby',
  'slate',
];

const WEEK = [
  { day: 'Mon', value: 14 },
  { day: 'Tue', value: 19 },
  { day: 'Wed', value: 8 },
  { day: 'Thu', value: 15 },
  { day: 'Fri', value: 22 },
  { day: 'Sat', value: 17 },
  { day: 'Sun', value: 9 },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ---------------- Confirm delete ---------------- */

function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm delete">
      <p className="text-sm text-zinc-300">
        Delete <span className="font-semibold text-white">{title}</span>?
      </p>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>
    </Modal>
  );
}

/* ---------------- Product form ---------------- */

function ProductFormModal({
  open,
  onClose,
  product,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
}) {
  const isEdit = product !== null;
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    mrp: '',
    shortDescription: '',
    description: '',
    tone: 'graphite' as Tone,
    featured: false,
    visible: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sync = () => {
    setForm({
      name: product?.name ?? '',
      category: product?.category ?? '',
      brand: product?.brand ?? '',
      price: product ? String(product.price) : '',
      mrp: product?.mrp ? String(product.mrp) : '',
      shortDescription: product?.shortDescription ?? '',
      description: product?.description ?? '',
      tone: product?.tone ?? 'graphite',
      featured: product?.featured ?? false,
      visible: product?.visible ?? true,
    });
    setErrors({});
  };

  useEffect(() => {
    if (open) sync();
  }, [open, product]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit product' : 'Add product'}
      wide
    >
      <ProductFormInner
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        onOpen={sync}
onSave={() => {
            const errs: Record<string, string> = {};
            if (!form.name.trim()) errs.name = 'Name is required';
            if (!form.category.trim()) errs.category = 'Category is required';
            if (!form.brand.trim()) errs.brand = 'Brand is required';
            if (!form.price || Number(form.price) <= 0)
              errs.price = 'Enter a valid price';
            setErrors(errs);
            if (Object.keys(errs).length > 0) return;

            const newProduct: Product = product ?? {
              id: uid('pr'),
              slug: slugify(form.name),
              name: form.name.trim(),
              category: form.category.trim(),
              brand: form.brand.trim(),
              price: Number(form.price),
              mrp: form.mrp ? Number(form.mrp) : undefined,
              rating: 4.5,
              reviewCount: 0,
              specs: [],
              tags: [],
              seed: Math.floor(Math.random() * 200) + 1,
              isNew: true,
              shortDescription: form.shortDescription.trim(),
              description: form.description.trim(),
              tone: form.tone,
              featured: form.featured,
              visible: form.visible,
            };

            if (product) {
              // Editing: keep original id/slug, update other fields
              newProduct.id = product.id;
              newProduct.slug = product.slug;
            }

            onSave(newProduct);
            onClose();
          }}
      />
    </Modal>
  );
}

function ProductFormInner({
  form,
  setForm,
  errors,
  setErrors,
  onOpen,
  onSave,
}: {
  form: {
    name: string;
    category: string;
    brand: string;
    price: string;
    mrp: string;
    shortDescription: string;
    description: string;
    tone: Tone;
    featured: boolean;
    visible: boolean;
  };
  setForm: (f: typeof form) => void;
  errors: Record<string, string>;
  setErrors: (e: Record<string, string>) => void;
  onOpen: () => void;
  onSave: () => void;
}) {
  // resync whenever the modal opens with a new product
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key as string]: '' });
  };

  return (
      <form onSubmit={onSave} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Product name" name="name" error={errors.name} required>
          <Input name="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Category" name="category" error={errors.category} required>
          <Select name="category" value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Select…</option>
            {productCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Brand" name="brand" error={errors.brand} required>
          <Input name="brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)" name="price" error={errors.price} required>
            <Input name="price" type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} />
          </Field>
          <Field label="MRP (₹, optional)" name="mrp">
            <Input name="mrp" type="number" min={0} value={form.mrp} onChange={(e) => set('mrp', e.target.value)} />
          </Field>
        </div>
        <Field label="Short description" name="shortDescription">
          <Input name="shortDescription" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
        </Field>
        <Field label="Artwork tone" name="tone">
          <Select name="tone" value={form.tone} onChange={(e) => set('tone', e.target.value as Tone)}>
            {TONE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Full description" name="description">
            <Textarea name="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </div>
        <div className="flex items-center gap-8 sm:col-span-2">
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <Switch checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" />
            Featured
          </label>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <Switch checked={form.visible} onChange={(v) => set('visible', v)} label="Visible" />
            Visible on site
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
        <Button type="button" variant="ghost" onClick={onOpen}>
          Reset
        </Button>
        <Button type="submit">Save product</Button>
      </div>
    </form>
  );
}

/* ---------------- Service form ---------------- */

function ServiceFormModal({
  open,
  onClose,
  service,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (service: Service) => void;
}) {
  const isEdit = service !== null;
  const [form, setForm] = useState({
    name: '',
    category: '',
    tagline: '',
    description: '',
    priceFrom: '',
    priceTo: '',
    duration: '',
    features: '',
    tone: 'graphite' as Tone,
    featured: false,
    visible: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sync = () => {
    setForm({
      name: service?.name ?? '',
      category: service?.category ?? '',
      tagline: service?.tagline ?? '',
      description: service?.description ?? '',
      priceFrom: service ? String(service.priceFrom) : '',
      priceTo: service ? String(service.priceTo) : '',
      duration: service?.duration ?? '',
      features: service?.features.join('\n') ?? '',
      tone: service?.tone ?? 'graphite',
      featured: service?.featured ?? false,
      visible: service?.visible ?? true,
    });
    setErrors({});
  };

  useEffect(() => {
    if (open) sync();
  }, [open, service]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key as string]: '' });
  };

  const save = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.priceFrom || Number(form.priceFrom) <= 0)
      errs.priceFrom = 'Enter a valid starting price';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      id: service?.id ?? uid('sv'),
      slug: service?.slug ?? slugify(form.name),
      name: form.name.trim(),
      category: form.category.trim(),
      tagline: form.tagline.trim() || service?.tagline || '',
      description: form.description.trim() || service?.description || '',
      priceFrom: Number(form.priceFrom),
      priceTo: form.priceTo ? Number(form.priceTo) : Number(form.priceFrom),
      duration: form.duration.trim() || service?.duration || '1 day',
      features: form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      tone: form.tone,
      featured: form.featured,
      visible: form.visible,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit service' : 'Add service'}
      wide
    >
      <form onSubmit={save} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Service name" name="name" error={errors.name} required>
            <Input name="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Category" name="category" error={errors.category} required>
            <Input name="category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Detailing" />
          </Field>
          <Field label="Tagline" name="tagline">
            <Input name="tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </Field>
          <Field label="Duration" name="duration">
            <Input name="duration" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 1 day" />
          </Field>
          <Field label="Price from (₹)" name="priceFrom" error={errors.priceFrom} required>
            <Input name="priceFrom" type="number" min={0} value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} />
          </Field>
          <Field label="Price to (₹)" name="priceTo">
            <Input name="priceTo" type="number" min={0} value={form.priceTo} onChange={(e) => set('priceTo', e.target.value)} />
          </Field>
          <Field label="Artwork tone" name="tone">
            <Select name="tone" value={form.tone} onChange={(e) => set('tone', e.target.value as Tone)}>
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <Switch checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" />
              Featured
            </label>
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <Switch checked={form.visible} onChange={(v) => set('visible', v)} label="Visible" />
              Visible
            </label>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description" name="description">
              <Textarea name="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Features (one per line)" name="features">
              <Textarea name="features" rows={5} value={form.features} onChange={(e) => set('features', e.target.value)} placeholder={'9H certified hardness\n5–9 year durability'} />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save service</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- Gallery form ---------------- */

function GalleryFormModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (item: GalleryItem) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    vehicle: '',
    tone: 'graphite' as Tone,
    ratio: 'square' as GalleryItem['ratio'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key as string]: '' });
  };

  const save = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      id: uid('gl'),
      slug: slugify(form.title),
      title: form.title.trim(),
      category: form.category.trim(),
      vehicle: form.vehicle.trim() || 'Gandhinagar studio',
      tone: form.tone,
      ratio: form.ratio,
      seed: Math.floor(Math.random() * 200) + 1,
    });
    setForm({ title: '', category: '', vehicle: '', tone: 'graphite', ratio: 'square' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add gallery item">
      <form onSubmit={save} noValidate className="space-y-5">
        <Field label="Title" name="title" error={errors.title} required>
          <Input name="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Storm Grey Ceramic" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" name="category" error={errors.category} required>
            <Input name="category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Ceramic Coating" />
          </Field>
          <Field label="Vehicle" name="vehicle">
            <Input name="vehicle" value={form.vehicle} onChange={(e) => set('vehicle', e.target.value)} placeholder="e.g. Hyundai Tucson" />
          </Field>
          <Field label="Artwork tone" name="tone">
            <Select name="tone" value={form.tone} onChange={(e) => set('tone', e.target.value as Tone)}>
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Layout shape" name="ratio">
            <Select name="ratio" value={form.ratio} onChange={(e) => set('ratio', e.target.value as GalleryItem['ratio'])}>
              <option value="square">Square</option>
              <option value="wide">Wide</option>
              <option value="tall">Tall</option>
            </Select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add to gallery</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- Settings panel ---------------- */

function SettingsPanel() {
  const [form, setForm] = useState({
    businessName: settings.businessName,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    city: settings.city,
    gstin: settings.gstin,
    established: String(settings.established),
    instagram: settings.socials[0]?.url ?? '',
    facebook: settings.socials[1]?.url ?? '',
    youtube: settings.socials[2]?.url ?? '',
    maps: settings.socials[3]?.url ?? '',
  });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">
          Business settings
        </h3>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <Check className="h-3.5 w-3.5" /> Saved (demo — persists in this session)
          </span>
        )}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Business name" name="businessName">
          <Input name="businessName" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
        </Field>
        <Field label="Tagline" name="tagline">
          <Input name="tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
        <Field label="Phone" name="phone">
          <Input name="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="WhatsApp number" name="whatsapp" hint="Digits only, with country code.">
          <Input name="whatsapp" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
        </Field>
        <Field label="Email" name="email">
          <Input name="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="GSTIN" name="gstin">
          <Input name="gstin" value={form.gstin} onChange={(e) => set('gstin', e.target.value)} />
        </Field>
        <Field label="Address" name="address">
          <Input name="address" value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <Field label="City & PIN" name="city">
          <Input name="city" value={form.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="Established (year)" name="established">
          <Input name="established" type="number" min={1900} max={2100} value={form.established} onChange={(e) => set('established', e.target.value)} />
        </Field>
      </div>
      <p className="eyebrow mt-8 mb-4">Social links</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Instagram URL" name="instagram">
          <Input name="instagram" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
        </Field>
        <Field label="Facebook URL" name="facebook">
          <Input name="facebook" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} />
        </Field>
        <Field label="YouTube URL" name="youtube">
          <Input name="youtube" value={form.youtube} onChange={(e) => set('youtube', e.target.value)} />
        </Field>
        <Field label="Google Maps URL" name="maps">
          <Input name="maps" value={form.maps} onChange={(e) => set('maps', e.target.value)} />
        </Field>
      </div>
      <div className="mt-8 flex justify-end border-t border-white/[0.06] pt-5">
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}

/* ---------------- Stat card ---------------- */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ink-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {label}
        </p>
        <Icon className="h-4 w-4 text-gold-400" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
    </div>
  );
}

/* ---------------- Main dashboard ---------------- */

export default function AdminDashboard() {
  const {
    isAuthenticated,
    logout,
    products,
    saveProduct,
    deleteProduct,
    toggleProduct,
    services,
    saveService,
    deleteService,
    toggleService,
    galleryItems,
    addGalleryItem,
    deleteGalleryItem,
    appointments,
    setAppointmentStatus,
    messages,
    markRead,
    markAllRead,
    reviews,
    setReviewApproval,
  } = useAdmin();

  const [tab, setTab] = useState<Tab>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // products
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // services
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // gallery
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [deletingGalleryItem, setDeletingGalleryItem] = useState<GalleryItem | null>(null);

  // appointments
  const [appointmentFilter, setAppointmentFilter] = useState<string>('All');

  const unread = messages.filter((m) => !m.read).length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed',
  );

  const current = NAV.find((n) => n.id === tab) ?? NAV[0];
  const weekMax = Math.max(...WEEK.map((w) => w.value));

  const filteredAppointments = useMemo(
    () =>
      appointmentFilter === 'All'
        ? appointments
        : appointments.filter((a) => a.status === appointmentFilter),
    [appointments, appointmentFilter],
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const statusBadge: Record<AppointmentStatus, 'blue' | 'gold' | 'green' | 'red'> = {
    Pending: 'blue',
    Confirmed: 'gold',
    Completed: 'green',
    Cancelled: 'red',
  };

  const nav = (
    <>
      <nav className="space-y-1 p-3" aria-label="Admin">
        {NAV.map((item) => {
          const count =
            item.id === 'messages'
              ? unread
              : item.id === 'reviews'
                ? pendingReviews
                : 0;
          return (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setMobileNavOpen(false);
              }}
              className={classNames(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                tab === item.id
                  ? 'bg-gold-500/10 text-gold-300'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {count > 0 && (
                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-ink-950">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View website
        </a>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-ink-900 lg:flex">
        <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
          <Link to="/">
            <span className="sr-only">Kiran Car Accessories</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500">
              <Package className="h-4 w-4 text-ink-950" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-white">
                KIRAN <span className="text-gold-400">Admin</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Studio console
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/[0.06] bg-ink-900">
            <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
              <p className="font-display text-sm font-bold text-white">
                KIRAN <span className="text-gold-400">Admin</span>
              </p>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-ink-950/85 px-4 backdrop-blur lg:px-6">
          <button
            className="rounded-lg p-2 text-zinc-300 hover:bg-white/5 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-white">
            {current.label}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-zinc-500 sm:block">
              admin@kirancaraccessories.in
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 font-display text-xs font-bold text-gold-300">
              KA
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {/* ============ OVERVIEW ============ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Live products" value={products.filter((p) => p.visible).length} sub={`${products.length} total in catalogue`} icon={Package} />
                <StatCard label="Upcoming appointments" value={upcomingAppointments.length} sub="Pending + confirmed" icon={CalendarCheck} />
                <StatCard label="Unread messages" value={unread} sub="Across all channels" icon={Inbox} />
                <StatCard label="Reviews to approve" value={pendingReviews} sub="Moderation queue" icon={Star} />
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                {/* Chart */}
                <div className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6 lg:col-span-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold text-white">
                        Inquiries this week
                      </h3>
                      <p className="text-xs text-zinc-500">All channels combined</p>
                    </div>
                    <Badge variant="gold">
                      <TrendingUp className="h-3 w-3" /> +18% vs last week
                    </Badge>
                  </div>
                  <div className="mt-6 flex h-44 items-end gap-3">
                    {WEEK.map((w) => (
                      <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-400">{w.value}</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-gold-600/60 to-gold-400 transition-all"
                          style={{ height: `${(w.value / weekMax) * 100}%` }}
                          title={`${w.day}: ${w.value} inquiries`}
                        />
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                          {w.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-white">
                      Next appointments
                    </h3>
                    <button
                      onClick={() => setTab('appointments')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-gold-200"
                    >
                      View all <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {upcomingAppointments.slice(0, 3).map((a) => (
                      <li key={a.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-850 p-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/10">
                          <CalendarCheck className="h-4 w-4 text-gold-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {a.name} · {a.service}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {formatDate(a.date)} at {a.time} — {a.vehicle}
                          </p>
                        </div>
                        <Badge variant={statusBadge[a.status]}>{a.status}</Badge>
                      </li>
                    ))}
                    {upcomingAppointments.length === 0 && (
                      <li className="py-6 text-center text-sm text-zinc-500">
                        No upcoming appointments.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Recent messages */}
              <div className="rounded-2xl border border-white/[0.06] bg-ink-900 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-white">
                    Latest messages
                  </h3>
                  <button
                    onClick={() => setTab('messages')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-gold-200"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <ul className="mt-4 divide-y divide-white/[0.05]">
                  {messages.slice(0, 3).map((m) => (
                    <li key={m.id} className="flex items-center gap-4 py-3">
                      <span
                        className={classNames(
                          'h-2 w-2 shrink-0 rounded-full',
                          m.read ? 'bg-ink-600' : 'bg-gold-400',
                        )}
                        aria-label={m.read ? 'Read' : 'Unread'}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-100">
                          {m.name} <span className="text-zinc-500">· {m.subject}</span>
                        </p>
                        <p className="truncate text-xs text-zinc-500">{m.body}</p>
                      </div>
                      <span className="shrink-0 text-xs text-zinc-600">{timeAgo(m.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ============ PRODUCTS ============ */}
          {tab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  {products.length} products · {products.filter((p) => p.visible).length} live
                </p>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add product
                </Button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Visible</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                              <Artwork tone={p.tone} seed={p.seed} ring={false} className="h-full w-full" />
                            </span>
                            <div>
                              <p className="font-medium text-zinc-100">{p.name}</p>
                              <p className="text-xs text-zinc-500">
                                {p.category} · {p.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-200">
                          {formatINR(p.price)}
                        </td>
                        <td className="px-4 py-3">
                          <RatingStars rating={p.rating} size={12} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={p.featured}
                              onChange={() => toggleProduct(p.id, 'featured')}
                              label={`Toggle featured for ${p.name}`}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={p.visible}
                              onChange={() => toggleProduct(p.id, 'visible')}
                              label={`Toggle visibility for ${p.name}`}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              aria-label={`Edit ${p.name}`}
                              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-gold-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              aria-label={`Delete ${p.name}`}
                              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500">
                          No products yet. Add your first product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ SERVICES ============ */}
          {tab === 'services' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  {services.length} services · {services.filter((s) => s.visible).length} live
                </p>
                <Button
                  onClick={() => {
                    setEditingService(null);
                    setServiceModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add service
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border border-white/[0.06] bg-ink-900 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-semibold text-white">
                          {s.name}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {s.category} · {s.duration}
                        </p>
                      </div>
                      <Badge variant={s.visible ? 'green' : 'zinc'}>
                        {s.visible ? 'Live' : 'Hidden'}
                      </Badge>
                    </div>
                    <p className="mt-3 font-display text-sm font-bold text-gold-300">
                      {formatINR(s.priceFrom)} – {formatINR(s.priceTo)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{s.tagline}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <div className="flex items-center gap-5 text-xs text-zinc-400">
                        <label className="flex items-center gap-2">
                          <Switch
                            checked={s.featured}
                            onChange={() => toggleService(s.id, 'featured')}
                            label={`Toggle featured for ${s.name}`}
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-2">
                          <Switch
                            checked={s.visible}
                            onChange={() => toggleService(s.id, 'visible')}
                            label={`Toggle visibility for ${s.name}`}
                          />
                          Visible
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingService(s);
                            setServiceModalOpen(true);
                          }}
                          aria-label={`Edit ${s.name}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-gold-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingService(s)}
                          aria-label={`Delete ${s.name}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ GALLERY ============ */}
          {tab === 'gallery' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  {galleryItems.length} items in the gallery
                </p>
                <Button onClick={() => setGalleryModalOpen(true)}>
                  <Plus className="h-4 w-4" /> Add image
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {galleryItems.map((g) => (
                  <div
                    key={g.id}
                    className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900"
                  >
                    <div className="relative">
                      <Artwork tone={g.tone} seed={g.seed} className="aspect-[4/3]" />
                      <button
                        onClick={() => setDeletingGalleryItem(g)}
                        aria-label={`Delete ${g.title}`}
                        className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-red-500/80 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-zinc-100">{g.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {g.category} · {g.vehicle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ APPOINTMENTS ============ */}
          {tab === 'appointments' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setAppointmentFilter(s)}
                    className={classNames(
                      'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                      appointmentFilter === s
                        ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                        : 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Slot</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-100">{a.name}</p>
                          <p className="text-xs text-zinc-500">
                            {a.phone} · {a.reference}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{a.vehicle}</td>
                        <td className="px-4 py-3 text-zinc-300">{a.service}</td>
                        <td className="px-4 py-3 text-zinc-300">
                          {formatDate(a.date)} · {a.time}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadge[a.status]}>{a.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <Select
                              value={a.status}
                              onChange={(e) =>
                                setAppointmentStatus(
                                  a.id,
                                  e.target.value as AppointmentStatus,
                                )
                              }
                              aria-label={`Update status for ${a.reference}`}
                              className="w-32 px-3 py-1.5 text-xs"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500">
                          No appointments with this status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ MESSAGES ============ */}
          {tab === 'messages' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  {unread} unread of {messages.length} messages
                </p>
                {unread > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={classNames(
                      'rounded-2xl border p-5',
                      m.read
                        ? 'border-white/[0.06] bg-ink-900'
                        : 'border-gold-500/30 bg-gold-500/[0.04]',
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <p className="font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-zinc-500">
                          {m.phone} · {timeAgo(m.createdAt)}
                        </p>
                      </div>
                      <Badge className="ml-auto">{m.subject}</Badge>
                      {!m.read && <Badge variant="gold">New</Badge>}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.body}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {!m.read && (
                        <Button size="sm" variant="dark" onClick={() => markRead(m.id)}>
                          Mark read
                        </Button>
                      )}
                      <a
                        href={waLink(
                          `Hi ${m.name}, thanks for reaching out to Kiran Car Accessories regarding "${m.subject}". `,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500 hover:text-white"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Reply on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="py-12 text-center text-sm text-zinc-500">
                    Inbox is empty.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ============ REVIEWS ============ */}
          {tab === 'reviews' && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                {pendingReviews} pending approval · {reviews.filter((r) => r.approved).length} published
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-white/[0.06] bg-ink-900 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-white">{r.name}</p>
                      <RatingStars rating={r.rating} size={13} />
                      <span className="text-xs text-zinc-500">
                        {r.vehicle} · {r.service}
                      </span>
                      <Badge variant={r.approved ? 'green' : 'blue'} className="ml-auto">
                        {r.approved ? 'Published' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-zinc-200">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.content}</p>
                    <div className="mt-4 flex gap-2">
                      {!r.approved && (
                        <>
                          <Button size="sm" onClick={() => setReviewApproval(r.id, true)}>
                            <Check className="h-3.5 w-3.5" /> Approve & publish
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReviewApproval(r.id, false)}>
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </>
                      )}
                      {r.approved && (
                        <Button size="sm" variant="outline" onClick={() => setReviewApproval(r.id, false)}>
                          <X className="h-3.5 w-3.5" /> Unpublish
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ SETTINGS ============ */}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* Modals */}
      <ProductFormModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={editingProduct}
        onSave={saveProduct}
      />
      <ServiceFormModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        service={editingService}
        onSave={saveService}
      />
      <GalleryFormModal
        open={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSave={addGalleryItem}
      />
      <ConfirmDelete
        open={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) deleteProduct(deletingProduct.id);
          setDeletingProduct(null);
        }}
        title={deletingProduct?.name ?? ''}
        description="This removes the product from the catalogue immediately."
      />
      <ConfirmDelete
        open={deletingService !== null}
        onClose={() => setDeletingService(null)}
        onConfirm={() => {
          if (deletingService) deleteService(deletingService.id);
          setDeletingService(null);
        }}
        title={deletingService?.name ?? ''}
        description="This removes the service from the services page immediately."
      />
      <ConfirmDelete
        open={deletingGalleryItem !== null}
        onClose={() => setDeletingGalleryItem(null)}
        onConfirm={() => {
          if (deletingGalleryItem) deleteGalleryItem(deletingGalleryItem.id);
          setDeletingGalleryItem(null);
        }}
        title={deletingGalleryItem?.title ?? ''}
        description="This removes the image from the gallery immediately."
      />
    </div>
  );
}
