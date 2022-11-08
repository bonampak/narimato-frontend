import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { dateMethods, withAuth } from "../../utils";
import { projectDelete, projectGetAll } from "../../http";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Projects: NextPage = () => {
    const [projects, setProjects] = React.useState<null | any>(null);
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);

    const { refetch: refetchProjects } = useQuery(["projects"], projectGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setProjects(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!projects && <Loading isParent={false} />}

                    {projects && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Projects</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Name</th>
                                            <th className="text-sm">Deadline</th>
                                            <th className="text-sm">Organisation</th>
                                            <th className="text-sm">Date Created</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project: any, index: number) => (
                                            <tr key={project._id}>
                                                <th>{++index}</th>
                                                <td>{project.name}</td>
                                                <td>{project.deadline ? dateMethods.parseMonthDateYearTime(project.deadline) : "--None--"}</td>
                                                <td>{project.organisationRef ? project.organisationRef.name : "--DEFAULT--"}</td>
                                                <td>{dateMethods.parseMonthDateYearTime(project.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        <Link href={`/projects/${project._id}`} className="text-blue-500">
                                                            View
                                                        </Link>
                                                        <Link href={`/projects/${project._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this project, this cannot be undone")) return;
                                                                await projectDelete(project._id);
                                                                refetchProjects();
                                                            }}
                                                            className="text-red-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(Projects);
