import React from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import { withAuth } from "../../utils";
import { projectDelete, projectGetAll } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const ManageProject: NextPage = () => {
    const router = useRouter();

    const [projects, setProjects] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery("projects", projectGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { mutate: deleteProject } = useMutation(projectDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects((projects as any[]).filter((project: any) => project._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteProject(projectId: string) {
        if (confirm("Are you sure you want to delete this project?")) deleteProject(projectId);
    }

    return (
        <>
            <Head>
                <title>All Projects - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !projects && <LoadingComponent />}

                    {!isLoading && projects && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Projects</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Name</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Organisation Name</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {projects.map((project: any, index: number) => {
                                                return (
                                                    <tr key={project._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{project.name}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{project.organisation.name}</td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/projects/${project._id}`}>
                                                                    <a className="px-2 text-blue-600">View</a>
                                                                </Link>
                                                                <Link href={`/projects/${project._id}/edit`}>
                                                                    <a className="px-2">Edit</a>
                                                                </Link>
                                                                <button onClick={() => handleDeleteProject(project._id)} className="px-2">
                                                                    <a className="text-red-600">Delete</a>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(ManageProject);
