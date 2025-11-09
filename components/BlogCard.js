import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={225}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <time dateTime={post.date}>{post.formattedDate}</time>
          <span className="mx-2">•</span>
          <span>{post.readTime} min read</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}