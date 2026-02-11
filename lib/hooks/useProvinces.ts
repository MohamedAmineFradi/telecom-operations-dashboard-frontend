import { useQuery } from '@tanstack/react-query'
import { provincesApi } from '@/lib/api'

export function useProvinces() {
    return useQuery({
        queryKey: ['provinces'],
        queryFn: () => provincesApi.getAllProvinces(),
    })
}

export function useProvince(provincia: string) {
    return useQuery({
        queryKey: ['provinces', provincia],
        queryFn: () => provincesApi.getProvinceDetails(provincia),
        enabled: !!provincia,
    })
}
