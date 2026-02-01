import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type InsertBlogPost, type BlogPost, changePasswordSchema, insertUserSchema, type InsertUser, type User } from "@shared/schema";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/use-posts";
import { useContactMessages } from "@/hooks/use-contact";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Save, Image as ImageIcon, LayoutGrid, EyeOff, MessageSquare, Settings, Users, Shield, ShieldAlert } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageGallery from "@/components/ImageGallery";
import { Switch } from "@/components/ui/switch";

import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export default function Admin() {
    const { user, logoutMutation, changePasswordMutation, users, createUserMutation, updateUserRoleMutation, adminResetPasswordMutation } = useAuth();
    const { data: posts, isLoading } = usePosts();
    const { data: contactMessages, isLoading: isLoadingMessages } = useContactMessages();
    const { mutate: createPost, isPending: isCreating } = useCreatePost();
    const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
    const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
    const { toast } = useToast();

    const [mode, setMode] = useState<"list" | "create" | "edit" | "gallery" | "messages" | "settings" | "users">("list");
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // User Management State
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
    const [newResetPassword, setNewResetPassword] = useState("");

    // Image Picker State
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<"cover" | "content">("cover");

    const createUserForm = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "user",
        },
    });

    const form = useForm<InsertBlogPost>({
        resolver: zodResolver(insertBlogPostSchema),
        defaultValues: {
            title: "",
            slug: "",
            summary: "",
            content: "",
            coverImage: "",
            isPublished: false, // Default to draft
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const onCreateUserSubmit = (data: InsertUser) => {
        createUserMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateUserOpen(false);
                createUserForm.reset();
            }
        });
    };

    const handleRoleUpdate = (id: number, currentRole: "admin" | "user") => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        updateUserRoleMutation.mutate({ id, role: newRole });
    };

    const handleResetPassword = (id: number) => {
        if (!newResetPassword) return;
        adminResetPasswordMutation.mutate({ id, newPassword: newResetPassword }, {
            onSuccess: () => {
                setResetPasswordId(null);
                setNewResetPassword("");
            }
        });
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        form.reset({
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            content: post.content,
            coverImage: post.coverImage,
            isPublished: post.isPublished,
        });
        setMode("edit");
    };

    const handleCreate = () => {
        setEditingPost(null);
        form.reset({
            title: "",
            slug: "",
            summary: "",
            content: "",
            coverImage: "",
            isPublished: true,
        });
        setMode("create");
    };

    const confirmDelete = (id: number) => {
        deletePost(id, {
            onSuccess: () => {
                toast({ title: "Success", description: "Post deleted successfully" });
                setDeleteId(null);
            },
            onError: () => {
                toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
            },
        });
    };

    const openImagePicker = (target: "cover" | "content") => {
        setPickerTarget(target);
        setIsImagePickerOpen(true);
    };

    const handleImageSelect = (url: string) => {
        if (pickerTarget === "cover") {
            form.setValue("coverImage", url);
        } else {
            const currentContent = form.getValues("content");
            const imageMarkdown = `\n![Image](${url})\n`;
            form.setValue("content", currentContent + imageMarkdown);
        }
        setIsImagePickerOpen(false);
    };

    const onSubmit = (data: InsertBlogPost) => {
        if (mode === "create") {
            createPost(data, {
                onSuccess: () => {
                    toast({ title: "Success", description: "Post published successfully" });
                    setMode("list");
                },
                onError: () => {
                    toast({ title: "Error", description: "Failed to publish post", variant: "destructive" });
                },
            });
        } else if (mode === "edit" && editingPost) {
            updatePost({ id: editingPost.id, ...data }, {
                onSuccess: () => {
                    toast({ title: "Success", description: "Post updated successfully" });
                    setMode("list");
                },
                onError: () => {
                    toast({ title: "Error", description: "Failed to update post", variant: "destructive" });
                },
            });
        }
    };

    const onPasswordSubmit = (data: any) => {
        changePasswordMutation.mutate(data, {
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    // Filter posts for non-admin if needed?
    // Actually simpler: Admin sees everything. User sees "Create" and maybe their own drafts (future).
    // For now, let's restrict the dashboard features.

    const isAdmin = user?.role === "admin";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        {mode === "list" && "Dashboard"}
                        {mode === "gallery" && "Media Library"}
                        {mode === "messages" && "Contact Messages"}
                        {mode === "users" && "User Management"}
                        {mode === "settings" && "Account Settings"}
                        {mode === "create" && "New Post"}
                        {mode === "edit" && "Edit Post"}
                    </h1>

                    <div className="flex gap-4">
                        <button
                            onClick={() => logoutMutation.mutate()}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </button>

                        {mode === "list" && (
                            <>
                                <button
                                    onClick={() => setMode("settings")}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                                >
                                    <Settings size={18} /> Settings
                                </button>
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={() => setMode("users")}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                                        >
                                            <Users size={18} /> Users
                                        </button>
                                        <button
                                            onClick={() => setMode("messages")}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare size={18} /> Messages
                                        </button>
                                        <button
                                            onClick={() => setMode("gallery")}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                                        >
                                            <ImageIcon size={18} /> Media Library
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        {mode !== "list" && (
                            <button
                                onClick={() => setMode("list")}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={16} /> Back to Dashboard
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {mode === "list" ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <button
                                    onClick={handleCreate}
                                    className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-lg font-medium text-white">Create New Post</span>
                                </button>

                                {posts?.map((post: BlogPost) => (
                                    <div key={post.id} className="bg-secondary/20 border border-white/5 rounded-xl overflow-hidden flex flex-col relative group">
                                        {String(post.isPublished) === 'false' && (
                                            <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md text-white/80 text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                                                <EyeOff size={12} /> Draft
                                            </div>
                                        )}
                                        <div className="h-32 overflow-hidden relative">
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col">
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{post.summary}</p>
                                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                                                <Link href={`/blog/${post.slug}`} className="text-xs text-primary hover:underline flex-grow">
                                                    View Live
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(post)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-cyan-400 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(post.id)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
                                                            title="Delete"
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : mode === "messages" ? (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-secondary/20 border border-white/5 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-white">
                                        <thead className="bg-white/5 uppercase font-medium text-xs">
                                            <tr>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">Company</th>
                                                <th className="px-6 py-4">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {isLoadingMessages ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                        Loading messages...
                                                    </td>
                                                </tr>
                                            ) : contactMessages?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                        No messages found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                contactMessages?.map((msg: any) => (
                                                    <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                            {new Date(msg.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">{msg.name}</td>
                                                        <td className="px-6 py-4">{msg.email}</td>
                                                        <td className="px-6 py-4">{msg.company || "-"}</td>
                                                        <td className="px-6 py-4 min-w-[300px] whitespace-pre-wrap">{msg.message}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    ) : mode === "users" ? (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">User Management</h2>
                                <button
                                    onClick={() => setIsCreateUserOpen(true)}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={18} /> Add User
                                </button>
                            </div>

                            <div className="bg-secondary/20 border border-white/5 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-white">
                                        <thead className="bg-white/5 uppercase font-medium text-xs">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Username</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Created At</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 text-muted-foreground">#{u.id}</td>
                                                    <td className="px-6 py-4 font-medium">{u.username}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt as any).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setResetPasswordId(u.id)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-yellow-400 transition-colors"
                                                            title="Reset Password"
                                                        >
                                                            <ShieldAlert size={16} />
                                                        </button>
                                                        {u.id !== user?.id && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(u.id, u.role as "admin" | "user")}
                                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-cyan-400 transition-colors"
                                                                title={u.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                                            >
                                                                <Shield size={16} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    ) : mode === "settings" ? (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-xl mx-auto"
                        >
                            <div className="bg-secondary/20 border border-white/5 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Current Password</label>
                                        <input
                                            type="password"
                                            {...passwordForm.register("currentPassword")}
                                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                        />
                                        {passwordForm.formState.errors.currentPassword && <p className="text-red-400 text-xs">{passwordForm.formState.errors.currentPassword.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">New Password</label>
                                        <input
                                            type="password"
                                            {...passwordForm.register("newPassword")}
                                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                        />
                                        {passwordForm.formState.errors.newPassword && <p className="text-red-400 text-xs">{passwordForm.formState.errors.newPassword.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {changePasswordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : mode === "gallery" ? (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ImageGallery />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-3xl mx-auto"
                        >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-secondary/20 p-8 rounded-xl border border-white/5">

                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Post Details</h3>
                                        <p className="text-sm text-muted-foreground">Manage your blog post content.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <>
                                                <span className="text-sm font-medium text-white">Published</span>
                                                <Switch
                                                    checked={form.watch("isPublished")}
                                                    onCheckedChange={(checked) => form.setValue("isPublished", checked)}
                                                />
                                            </>
                                        )}
                                        {!isAdmin && (
                                            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Draft Mode</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Title</label>
                                    <input
                                        {...form.register("title")}
                                        className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="Enter post title"
                                    />
                                    {form.formState.errors.title && <p className="text-red-400 text-xs">{form.formState.errors.title.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Slug (URL)</label>
                                        <input
                                            {...form.register("slug")}
                                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="my-new-post"
                                        />
                                        {form.formState.errors.slug && <p className="text-red-400 text-xs">{form.formState.errors.slug.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Summary</label>
                                        <input
                                            {...form.register("summary")}
                                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="Brief description"
                                        />
                                        {form.formState.errors.summary && <p className="text-red-400 text-xs">{form.formState.errors.summary.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Cover Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            {...form.register("coverImage")}
                                            className="flex-grow px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => openImagePicker("cover")}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <ImageIcon size={18} /> Select
                                        </button>
                                    </div>
                                    {form.formState.errors.coverImage && <p className="text-red-400 text-xs">{form.formState.errors.coverImage.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-white">Content (Markdown)</label>
                                        <button
                                            type="button"
                                            onClick={() => openImagePicker("content")}
                                            className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded flex items-center gap-1 text-primary transition-colors"
                                        >
                                            <ImageIcon size={14} /> Insert Image
                                        </button>
                                    </div>
                                    <textarea
                                        {...form.register("content")}
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors font-mono text-sm"
                                        placeholder="# Heading..."
                                    />
                                    {form.formState.errors.content && <p className="text-red-400 text-xs">{form.formState.errors.content.message}</p>}
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setMode("list")}
                                        className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating || isUpdating}
                                        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isCreating || isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                                        {mode === "create" ? "Publish Post" : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete the blog post.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && confirmDelete(deleteId)}
                                className="bg-red-500 hover:bg-red-600 text-white border-0"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Image Picker Dialog */}
                <Dialog open={isImagePickerOpen} onOpenChange={setIsImagePickerOpen}>
                    <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Select Image</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-y-auto p-1">
                            <ImageGallery onSelect={handleImageSelect} />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Create User Dialog */}
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogContent className="bg-[#0f172a] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={createUserForm.handleSubmit(onCreateUserSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Username</label>
                                <input
                                    {...createUserForm.register("username")}
                                    className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                />
                                {createUserForm.formState.errors.username && <p className="text-red-400 text-xs">{createUserForm.formState.errors.username.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Password</label>
                                <input
                                    type="password"
                                    {...createUserForm.register("password")}
                                    className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                />
                                {createUserForm.formState.errors.password && <p className="text-red-400 text-xs">{createUserForm.formState.errors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Role</label>
                                <select
                                    {...createUserForm.register("role")}
                                    className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={createUserMutation.isPending}
                                className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {createUserMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create User"}
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Reset Password Dialog */}
                <Dialog open={!!resetPasswordId} onOpenChange={(open) => !open && setResetPasswordId(null)}>
                    <DialogContent className="bg-[#0f172a] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Reset User Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">New Password</label>
                                <input
                                    type="password"
                                    value={newResetPassword}
                                    onChange={(e) => setNewResetPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <button
                                onClick={() => resetPasswordId && handleResetPassword(resetPasswordId)}
                                disabled={adminResetPasswordMutation.isPending || !newResetPassword}
                                className="w-full py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {adminResetPasswordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
