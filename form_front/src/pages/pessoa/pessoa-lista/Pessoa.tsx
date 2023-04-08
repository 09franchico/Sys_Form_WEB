import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { LayoutPage } from '../../../shared/layout/LayoutPage';
import { Button } from 'primereact/button';
import { PessoasService } from '../../../shared/service/api/pessoa/PessoaService';
import { IPessoa } from '../../../shared/types/Pessoa';
import { useNavigate } from 'react-router';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';


export const Pessoa = () => {
  const navigate = useNavigate()
  const [pessoa, setPessoa] = useState<IPessoa[]>([]);
  const toast: any = useRef(null);
  
  const accept = (id:number) => {
    toast.current.show({ severity: 'info', summary: 'Confirmado', detail: 'você aceitou', life: 1000 });
    PessoasService.deleteById(id)
        .then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result)
            setPessoa(pessoas => pessoas.filter(pessoa => pessoa.id !== id));
          }
        });
  }
  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejeitado', detail: 'você rejeitou', life: 1000 });
  }

  useEffect(() => {
    PessoasService.getAll()
      .then((result) => {
        //   setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setPessoa(result.data)
          console.log("Passou aqui os dados", result.data);
        }
      });
  }, [setPessoa]);


  //Delete da pessoa
  const HandleDeleteId = (id: number) => {
    confirmDialog({
      message: 'Deseja excluir este registro?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept:()=>accept(id),
      reject
    });
  }


  // pi-user-plus
  return (
    <LayoutPage urlFerramenta='/pessoa' mostrarFerramenta={true}>
      <div className="card">
        <Toast ref={toast} />
        <ConfirmDialog />
        <DataTable value={pessoa} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
          <Column field="nome" header="Nome" style={{ width: '10%' }}></Column>
          <Column field="dataNascimento" header="Data de Nascimento" style={{ width: '10%' }}></Column>
          <Column field="endereco.bairro" header="Bairro" style={{ width: '10%' }}></Column>
          <Column field="endereco.cep" header="CEP" style={{ width: '10%' }}></Column>
          <Column header="Ações" body={(rowData) => (
            <div>
              <Button className="m-1" icon="pi pi-eye" severity="secondary" aria-label="eye" />
              <Button className="m-1" icon="pi pi-pencil" severity="info" aria-label="pencil" onClick={() => navigate(`/pessoa/detalhe/${rowData.id}`)} />
              <Button className="m-1" icon="pi pi-trash" severity="danger" onClick={() => HandleDeleteId(rowData.id)} />
            </div>
          )} style={{ width: "6.5%" }} align={'center'}>
          </Column>
        </DataTable>
      </div>
    </LayoutPage>
  )
}