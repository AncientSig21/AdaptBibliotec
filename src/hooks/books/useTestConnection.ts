import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';

export const useTestConnection = () => {
	return useQuery({
		queryKey: ['testConnection'],
		queryFn: async () => {
			console.log('Testing Supabase connection...');
			console.log('Supabase URL:', import.meta.env.VITE_PROJECT_URL_SUPABASE);
			console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_API_KEY);
			
			// Test simple query
			const { data, error } = await supabase
				.from('Libros')
				.select('count')
				.limit(1);

			if (error) {
				console.error('Supabase connection error:', error);
				throw new Error(error.message);
			}

			console.log('Supabase connection successful');
			return { success: true, data };
		},
		retry: false, // Don't retry on failure
	});
}; 