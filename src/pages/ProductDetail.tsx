import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string; // ISO date string
  reviewerName: string;
  reviewerEmail: string;
}

interface DeletedProduct extends ProductDetail {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  isDeleted: Boolean;
  deletedOn: string;
}

const fetchProductDetail = async (id: string | undefined) => {
  return await axios.get<ProductDetail>(`/product/${id}`);
};

const deleteProduct = async (id: string | undefined) => {
  return await axios.delete<DeletedProduct>(`product/${id}`);
};

const ProductDetailSkeleton = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg rounded-lg shadow-lg bg-gray-300 animate-pulse"></div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-4">
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-300 rounded animate-pulse w-full"></div>

            {/* Description Skeleton */}
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>

            {/* Price and Discount Skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-8 bg-gray-300 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
            </div>

            {/* Stock Status Skeleton */}
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>

            {/* Brand and SKU Skeleton */}
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
            </div>

            {/* Weight and Dimensions Skeleton */}
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
            </div>

            {/* Warranty and Shipping Information Skeleton */}
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
            </div>

            {/* Return Policy and Minimum Order Quantity Skeleton */}
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
            </div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-gray-300 rounded animate-pulse w-full mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const getProductDetail = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchProductDetail(id),
  });
  const product: ProductDetail | undefined = getProductDetail.data?.data;
  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(id),
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (deleteProductMutation.isSuccess) {
      navigate("/product", { replace: true });
    }
  }, [deleteProductMutation.isSuccess]);
  return (
    <>
      {getProductDetail.isFetching || product == undefined ? (
        <ProductDetailSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {deleteProductMutation.isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
                <span className="text-2xl mr-4 text-gray-800">Deleting...</span>
                <svg
                  className="animate-spin h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full max-w-lg rounded-lg shadow-lg"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Description */}
              <p className="text-gray-600">{product.description}</p>

              {/* Price and Discount */}
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-red-600 line-through">
                  $
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-green-600">
                  {product.discountPercentage.toFixed(2)}% off
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-gray-600">{product.rating.toFixed(2)}</p>
              </div>

              {/* Stock Status */}
              <p className="text-gray-600">
                <span className="font-bold">Stock Status:</span>{" "}
                {product.availabilityStatus}
              </p>

              {/* Brand and SKU */}
              <div className="flex space-x-4">
                <p className="text-gray-600">
                  <span className="font-bold">Brand:</span> {product.brand}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">SKU:</span> {product.sku}
                </p>
              </div>

              {/* Weight and Dimensions */}
              <div className="flex space-x-4">
                <p className="text-gray-600">
                  <span className="font-bold">Weight:</span> {product.weight} oz
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Dimensions:</span>{" "}
                  {product.dimensions.width} x {product.dimensions.height} x{" "}
                  {product.dimensions.depth} mm
                </p>
              </div>

              {/* Warranty and Shipping Information */}
              <div className="flex space-x-4">
                <p className="text-gray-600">
                  <span className="font-bold">Warranty:</span>{" "}
                  {product.warrantyInformation}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Shipping:</span>{" "}
                  {product.shippingInformation}
                </p>
              </div>

              {/* Return Policy and Minimum Order Quantity */}
              <div className="flex space-x-4">
                <p className="text-gray-600">
                  <span className="font-bold">Return Policy:</span>{" "}
                  {product.returnPolicy}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Minimum Order Quantity:</span>{" "}
                  {product.minimumOrderQuantity}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p className="text-gray-600">{review.rating}</p>
                  </div>
                  <p className="text-gray-800">{review.comment}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    - {review.reviewerName} on{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <div className="fixed bottom-4 right-4 z-50">
                <div className="relative group">
                  <button className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg w-32 hidden group-focus-within:block">
                    <button
                      onClick={() => {
                        // navigate("edit");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onClick={() => {
                        if (
                          confirm("Are you sure want to delete this product ? ")
                        ) {
                          deleteProductMutation.mutate();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
