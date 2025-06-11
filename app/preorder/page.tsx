'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface PreOrder {
  id: number;
  sales: string;
  customer: string;
  noPO: string;
  tanggal: string;
  materials: Material[];
}

interface Material {
  id: number;
  noSuratJalan: string;
  namaMaterial: string;
  qty?: number;
  satuan?: string;
}

interface FormData {
  sales: string;
  customer: string;
  noPO: string;
  tanggal: string;
  materials: Material[];
}

export default function PreOrderPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([
    {
      id: 1,
      sales: 'John Doe',
      customer: 'PT ABC',
      noPO: 'PO-001',
      tanggal: '2024-01-15',
      materials: [
        {
          id: 1,
          noSuratJalan: 'SJ-001',
          namaMaterial: 'Kabel Listrik',
          qty: 100,
          satuan: 'meter',
        },
      ],
    },
    {
      id: 2,
      sales: 'Jane Smith',
      customer: 'CV XYZ',
      noPO: 'PO-002',
      tanggal: '2024-01-16',
      materials: [
        {
          id: 1,
          noSuratJalan: 'SJ-002',
          namaMaterial: 'Pipa PVC',
          qty: 50,
          satuan: 'batang',
        },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPreOrder, setCurrentPreOrder] = useState<PreOrder | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sales: '',
    customer: '',
    noPO: '',
    tanggal: '',
    materials: [
      {
        id: 1,
        noSuratJalan: '',
        namaMaterial: '',
        qty: undefined,
        satuan: '',
      },
    ],
  });

  const filteredPreOrders = preOrders.filter(
    (preOrder) =>
      preOrder.sales.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preOrder.noPO.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setCurrentPreOrder(null);
    setIsViewMode(false);
    setFormData({
      sales: '',
      customer: '',
      noPO: '',
      tanggal: '',
      materials: [
        {
          id: 1,
          noSuratJalan: '',
          namaMaterial: '',
          qty: undefined,
          satuan: '',
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (preOrder: PreOrder) => {
    setCurrentPreOrder(preOrder);
    setIsViewMode(false);
    setFormData({
      sales: preOrder.sales,
      customer: preOrder.customer,
      noPO: preOrder.noPO,
      tanggal: preOrder.tanggal,
      materials: preOrder.materials,
    });
    setIsModalOpen(true);
  };

  const handleView = (preOrder: PreOrder) => {
    setCurrentPreOrder(preOrder);
    setIsViewMode(true);
    setFormData({
      sales: preOrder.sales,
      customer: preOrder.customer,
      noPO: preOrder.noPO,
      tanggal: preOrder.tanggal,
      materials: preOrder.materials,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPreOrders(preOrders.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPreOrder) {
      // Edit existing preorder
      setPreOrders(
        preOrders.map((p) =>
          p.id === currentPreOrder.id ? { ...currentPreOrder, ...formData } : p
        )
      );
    } else {
      // Create new preorder
      const newPreOrder: PreOrder = {
        id: Math.max(...preOrders.map((p) => p.id)) + 1,
        ...formData,
      };
      setPreOrders([...preOrders, newPreOrder]);
    }

    setIsModalOpen(false);
  };

  const addMaterialRow = () => {
    const newMaterial: Material = {
      id: Math.max(...formData.materials.map((m) => m.id)) + 1,
      noSuratJalan: '',
      namaMaterial: '',
      qty: undefined,
      satuan: '',
    };
    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    });
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updatedMaterials = formData.materials.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      const updatedMaterials = formData.materials.filter((_, i) => i !== index);
      setFormData({ ...formData, materials: updatedMaterials });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PreOrder Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>PreOrder List</CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create PreOrder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isViewMode
                      ? 'View PreOrder'
                      : currentPreOrder
                      ? 'Edit PreOrder'
                      : 'Create PreOrder'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card 1 - Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sales">Sales *</Label>
                        <Input
                          id="sales"
                          value={formData.sales}
                          onChange={(e) =>
                            setFormData({ ...formData, sales: e.target.value })
                          }
                          placeholder="Enter sales name"
                          required
                          disabled={isViewMode}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tanggal">Tanggal *</Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={formData.tanggal}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tanggal: e.target.value,
                            })
                          }
                          required
                          disabled={isViewMode}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="noPO">No PO *</Label>
                        <Input
                          id="noPO"
                          value={formData.noPO}
                          onChange={(e) =>
                            setFormData({ ...formData, noPO: e.target.value })
                          }
                          placeholder="Enter PO number"
                          required
                          disabled={isViewMode}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="customer">Customer *</Label>
                        <Input
                          id="customer"
                          value={formData.customer}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer: e.target.value,
                            })
                          }
                          placeholder="Enter customer name"
                          required
                          disabled={isViewMode}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2 - Materials */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Materials</CardTitle>
                        {!isViewMode && (
                          <Button
                            type="button"
                            onClick={addMaterialRow}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Pekerjaan
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.materials.map((material, index) => (
                        <div
                          key={material.id}
                          className="p-4 border rounded-lg space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Material {index + 1}
                            </h4>
                            {!isViewMode && formData.materials.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeMaterial(index)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>No Surat Jalan</Label>
                              <Input
                                value={material.noSuratJalan}
                                onChange={(e) =>
                                  updateMaterial(
                                    index,
                                    'noSuratJalan',
                                    e.target.value
                                  )
                                }
                                placeholder="Enter surat jalan number"
                                disabled={isViewMode}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Nama Material</Label>
                              <Input
                                value={material.namaMaterial}
                                onChange={(e) =>
                                  updateMaterial(
                                    index,
                                    'namaMaterial',
                                    e.target.value
                                  )
                                }
                                placeholder="Enter material name"
                                disabled={isViewMode}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={material.qty || ''}
                                onChange={(e) =>
                                  updateMaterial(
                                    index,
                                    'qty',
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                                placeholder="Enter quantity"
                                disabled={isViewMode}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Satuan</Label>
                              <Input
                                value={material.satuan || ''}
                                onChange={(e) =>
                                  updateMaterial(
                                    index,
                                    'satuan',
                                    e.target.value
                                  )
                                }
                                placeholder="Enter unit"
                                disabled={isViewMode}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {!isViewMode && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {currentPreOrder ? 'Update' : 'Save'}
                      </Button>
                    </div>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search by sales, customer, or PO number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>No PO</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPreOrders.map((preOrder) => (
                <TableRow key={preOrder.id}>
                  <TableCell>{preOrder.sales}</TableCell>
                  <TableCell>{preOrder.customer}</TableCell>
                  <TableCell>{preOrder.noPO}</TableCell>
                  <TableCell>{preOrder.tanggal}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(preOrder)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(preOrder)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(preOrder.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}