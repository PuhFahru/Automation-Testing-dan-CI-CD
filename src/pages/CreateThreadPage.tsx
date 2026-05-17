import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { createThread } from '../store/slices/threadsSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Tag, Loader2 } from 'lucide-react';

const CreateThreadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.threads);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Diperlukan</h2>
          <p className="text-muted-foreground mb-6">
            Anda harus login untuk membuat thread.
          </p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      const result = await dispatch(
        createThread({
          title: title.trim(),
          body: body.trim(),
          category: category.trim() || undefined,
        })
      ).unwrap();
      navigate(`/threads/${result.id}`);
    } catch {
      // error handled by slice
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden animate-fade-in">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Buat Thread Baru</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bagikan ide atau pertanyaan Anda ke komunitas
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Judul Thread
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Apa yang ingin Anda diskusikan?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Kategori
                    <span className="text-muted-foreground font-normal ml-1">(opsional)</span>
                  </label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Contoh: General, Help, Discussion"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    icon={<Tag className="h-4 w-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="body" className="text-sm font-medium">
                    Isi Thread
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Jelaskan ide atau pertanyaan Anda secara detail..."
                    className="w-full min-h-[200px] p-4 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !title.trim() || !body.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Membuat...
                      </>
                    ) : (
                      <>
                        Buat Thread
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                  >
                    <Link to="/">Batal</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateThreadPage;