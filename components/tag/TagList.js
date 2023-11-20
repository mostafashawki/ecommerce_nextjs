"use client";
import { useEffect } from "react";
import useTagStore from "@/store/tag";

export default function TagList() {
  const { tags, fetchTags, setUpdatingTag } = useTagStore();

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      {tags?.map((t) => (
        <button className="btn" onClick={() => setUpdatingTag(t)}>
          {t.name}
        </button>
      ))}
    </>
  );
}
