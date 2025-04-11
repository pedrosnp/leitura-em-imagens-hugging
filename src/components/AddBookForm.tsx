
import { useState } from 'react';
import { Book, BookType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
  defaultType?: BookType;
}

const AddBookForm = ({ onAddBook, defaultType = 'book' }: AddBookFormProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [type, setType] = useState<BookType>(defaultType);
  const [pagesTotal, setPagesTotal] = useState<number>(0);
  const [pagesRead, setPagesRead] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || pagesTotal <= 0) return;

    const newBook: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      coverUrl: coverUrl || undefined,
      type,
      pagesTotal,
      pagesRead,
      startDate: pagesRead > 0 ? new Date() : undefined,
      notes: notes || undefined,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    onAddBook(newBook);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setType(defaultType);
    setPagesTotal(0);
    setPagesRead(0);
    setNotes('');
    setTagsInput('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-book-primary hover:bg-book-secondary">
          <PlusCircle className="h-5 w-5" />
          Adicionar Leitura
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center font-serif">Nova Leitura</DialogTitle>
          <DialogDescription className="text-center">
            Adicione um novo livro ou HQ à sua coleção.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do livro ou HQ"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as BookType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Livro</SelectItem>
                    <SelectItem value="comic">HQ</SelectItem>
                    <SelectItem value="manga">Mangá</SelectItem>
                    <SelectItem value="graphic-novel">Graphic Novel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">URL da Capa (Opcional)</Label>
                <Input
                  id="coverUrl"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="http://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pagesTotal">Páginas Totais</Label>
                <Input
                  id="pagesTotal"
                  type="number"
                  value={pagesTotal || ''}
                  onChange={(e) => setPagesTotal(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pagesRead">Páginas Lidas</Label>
                <Input
                  id="pagesRead"
                  type="number"
                  value={pagesRead || ''}
                  onChange={(e) => setPagesRead(Number(e.target.value))}
                  min="0"
                  max={pagesTotal}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ficção, aventura, distopia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Suas anotações sobre esta leitura..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookForm;
