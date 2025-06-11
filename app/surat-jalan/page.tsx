'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { TableList } from '@/components/shared/TableList';
import { ModalForm } from '@/components/shared/ModalForm';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Filter } from 'lucide-react';

interface SJMaterial {
  id: number;
  namaMaterial: string;
  qty: string;
  satuan: string;
  harga: string;
}

interface SuratJalan {
  id: number;
  noSJ: string;
  tanggal: string;
  pembayaran: string;
  status: 'draft' | 'sent' | 'delivered' | 'completed';
  materials: SJMaterial[];
  totalHarga: number;
}

export default function SuratJalanPage() {
  const [suratJalans, setSuratJalans] = useState<SuratJalan[]>([
    {
      id: 1,
      noSJ: 'SJ-2024-001',
      tanggal: '2024-01-15',
      pembayaran: 'Transfer Bank',
      status: 'delivered',
      materials: [
        {
          id: 1,
          namaMaterial: 'Pipa PVC 3 inch',
          qty: '100',
          satuan: 'meter',
          harga: '50000',
        },
      ],
      totalHarga: 5000000,
    },
    {
      id: 2,
      noSJ: 'SJ-2024-002',
      tanggal: '2024-01-12',
      pembayaran: 'Cash',
      status: 'sent',
      materials: [],
      totalHarga: 3200000,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentSJ, setCurrentSJ] = useState<SuratJalan | null>(null);
  const [formData, setFormData] = useState({
    noSJ: '',
    tanggal: '',
    pembayaran: '',
    status: 'draft',
  });
  const [materials, setMaterials] = useState<SJMaterial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    materialName: '',
  });
  const itemsPerPage = 10;

  const materialOptions = ['Pipa PVC 3 inch', 'Pipa PVC 4 inch', 'Elbow PVC', 'Tee PVC', 'Socket PVC'];
  const satuanOptions = ['meter', 'pcs', 'kg', 'liter', 'box'];
  const pembayaranOptions = ['Cash', 'Transfer Bank', 'Credit', 'Cheque'];

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    delivered: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const calculateTotal = (sjMaterials: SJMaterial[]) => {
    return sjMaterials.reduce((total, material) => {
      const qty = parseInt(material.qty) || 0;
      const harga = parseInt(material.harga) || 0;
      return total + (qty * harga);
    }, 0);
  };

  const columns = [
    { key: 'noSJ', label: 'No SJ' },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'totalHarga',
      label: 'Total Harga',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge className={statusColors[value as keyof typeof statusColors]}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setCurrentSJ(null);
    setIsViewMode(false);
    setFormData({
      noSJ: '',
      tanggal: '',
      pembayaran: '',
      status: 'draft',
    });
    setMaterials([]);
    setIsModalOpen(true);
  };

  const handleEdit = (sj: SuratJalan) => {
    setCurrentSJ(sj);
    setIsViewMode(false);
    setFormData({
      noSJ: sj.noSJ,
      tanggal: sj.tanggal,
      pembayaran: sj.pembayaran,
      status: sj.status,
    });
    setMaterials(sj.materials);
    setIsModalOpen(true);
  };

  const handleView = (sj: SuratJalan) => {
    setCurrentSJ(sj);
    setIsViewMode(true);
    setFormData({
      noSJ: sj.noSJ,
      tanggal: sj.tanggal,
      pembayaran: sj.pembayaran,
      status: sj.status,
    });
    setMaterials(sj.materials);
    setIsModalOpen(true);
  };

  const handleDelete = (sj: SuratJalan) => {
    if (confirm('Are you sure you want to delete this surat jalan?')) {
      setSuratJalans(suratJalans.filter(s => s.id !== sj.id));
    }
  };

  const addMaterialRow = () => {
    const newMaterial: SJMaterial = {
      id: Math.max(0, ...materials.map(m => m.id)) + 1,
      namaMaterial: '',
      qty: '',
      satuan: '',
      harga: '',
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: number, field: keyof SJMaterial, value: string) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (!formData.noSJ || !formData.tanggal) {
      alert('Please fill in all required fields');
      return;
    }

    const totalHarga = calculateTotal(materials);
    const sjData = {
      ...formData,
      materials,
      totalHarga,
      status: formData.status as 'draft' | 'sent' | 'delivered' | 'completed',
    };

    if (currentSJ) {
      setSuratJalans(suratJalans.map(s => 
        s.id === currentSJ.id 
          ? { ...s, ...sjData }
          : s
      ));
    } else {
      const newSJ: SuratJalan = {
        id: Math.max(...suratJalans.map(s => s.id)) + 1,
        ...sjData,
      };
      setSuratJalans([...suratJalans, newSJ]);
    }

    setIsModalOpen(false);
  };

  // Filter functionality
  const filteredSJs = suratJalans.filter((sj) => {
    if (filters.dateFrom && sj.tanggal < filters.dateFrom) return false;
    if (filters.dateTo && sj.tanggal > filters.dateTo) return false;
    if (filters.status && sj.status !== filters.status) return false;
    if (filters.materialName) {
      const hasMaterial = sj.materials.some(m => 
        m.namaMaterial.toLowerCase().includes(filters.materialName.toLowerCase())
      );
      if (!hasMaterial) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredSJs.length / itemsPerPage);
  const paginatedSJs = filteredSJs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar title="Surat Jalan Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Manage Surat Jalan</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage delivery notes
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Surat Jalan
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Material Name</Label>
                <Input
                  value={filters.materialName}
                  onChange={(e) => setFilters({ ...filters, materialName: e.target.value })}
                  placeholder="Search material..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        <TableList
          data={paginatedSJs}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search surat jalan..."
          searchKey="noSJ"
        />

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            isViewMode 
              ? 'Surat Jalan Details' 
              : currentSJ 
                ? 'Edit Surat Jalan' 
                : 'Create New Surat Jalan'
          }
          onSave={!isViewMode ? handleSave : undefined}
        >
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="noSJ">No SJ *</Label>
                    <Input
                      id="noSJ"
                      value={formData.noSJ}
                      onChange={(e) => setFormData({ ...formData, noSJ: e.target.value })}
                      placeholder="Enter SJ number"
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tanggal">Tanggal *</Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pembayaran">Pembayaran</Label>
                    <Select 
                      value={formData.pembayaran} 
                      onValueChange={(value) => setFormData({ ...formData, pembayaran: value })}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {pembayaranOptions.map((payment) => (
                          <SelectItem key={payment} value={payment}>
                            {payment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Materials</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total: {formatCurrency(calculateTotal(materials))}
                  </p>
                </div>
                {!isViewMode && (
                  <Button onClick={addMaterialRow} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {materials.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No materials added yet
                  </p>
                ) : (
                  materials.map((material) => (
                    <div key={material.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Material #{material.id}</h4>
                        {!isViewMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <Label>Nama Material *</Label>
                          <Input
                            id="nama_material"
                            value={formData.noSJ}
                            onChange={(e) => setFormData({ ...formData, noSJ: e.target.value })}
                            placeholder="Enter Name Material"
                            disabled={isViewMode}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-2">
                            <Label>QTY</Label>
                            <Input
                              type="number"
                              value={material.qty}
                              onChange={(e) => updateMaterial(material.id, 'qty', e.target.value)}
                              placeholder="0"
                              disabled={isViewMode}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label>Satuan</Label>
                            <Select 
                              value={material.satuan}
                              onValueChange={(value) => updateMaterial(material.id, 'satuan', value)}
                              disabled={isViewMode}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {satuanOptions.map((satuan) => (
                                  <SelectItem key={satuan} value={satuan}>
                                    {satuan}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label>Harga</Label>
                            <Input
                              type="number"
                              value={material.harga}
                              onChange={(e) => updateMaterial(material.id, 'harga', e.target.value)}
                              placeholder="0"
                              disabled={isViewMode}
                            />
                          </div>
                        </div>

                        {material.qty && material.harga && (
                          <div className="text-right text-sm text-muted-foreground">
                            Subtotal: {formatCurrency(parseInt(material.qty) * parseInt(material.harga))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </ModalForm>
      </div>
    </>
  );
}