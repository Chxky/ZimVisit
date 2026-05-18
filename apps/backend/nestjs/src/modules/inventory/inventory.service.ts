import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { Hotel } from './entities/hotel.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepo: Repository<Tour>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  async createTour(operatorId: string, dto: CreateTourDto): Promise<Tour> {
    const tour = this.tourRepo.create({ ...dto, operatorId });
    return this.tourRepo.save(tour);
  }

  async findTours(filters: { category?: string; location?: string; minPrice?: number; maxPrice?: number } = {}) {
    const query = this.tourRepo.createQueryBuilder('tour').where('tour.isActive = true');

    if (filters.category) query.andWhere('tour.categories LIKE :category', { category: `%${filters.category}%` });
    if (filters.location) query.andWhere('tour.location LIKE :location', { location: `%${filters.location}%` });
    if (filters.minPrice) query.andWhere('tour.price >= :minPrice', { minPrice: filters.minPrice });
    if (filters.maxPrice) query.andWhere('tour.price <= :maxPrice', { maxPrice: filters.maxPrice });

    return query.orderBy('tour.rating', 'DESC').getMany();
  }

  async findTourById(id: string): Promise<Tour> {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException('Tour not found');
    return tour;
  }

  async findToursByOperator(operatorId: string): Promise<Tour[]> {
    return this.tourRepo.find({ where: { operatorId } });
  }

  async updateTour(id: string, dto: Partial<CreateTourDto>): Promise<Tour> {
    const tour = await this.findTourById(id);
    Object.assign(tour, dto);
    return this.tourRepo.save(tour);
  }

  async createHotel(operatorId: string, dto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepo.create({ ...dto, operatorId });
    return this.hotelRepo.save(hotel);
  }

  async findHotels(filters: { city?: string } = {}) {
    const query = this.hotelRepo.createQueryBuilder('hotel').where('hotel.isActive = true');
    if (filters.city) query.andWhere('hotel.city LIKE :city', { city: `%${filters.city}%` });
    return query.orderBy('hotel.rating', 'DESC').getMany();
  }

  async findHotelById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepo.findOne({ where: { id } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async findHotelsByOperator(operatorId: string): Promise<Hotel[]> {
    return this.hotelRepo.find({ where: { operatorId } });
  }

  async updateHotel(id: string, dto: Partial<CreateHotelDto>): Promise<Hotel> {
    const hotel = await this.findHotelById(id);
    Object.assign(hotel, dto);
    return this.hotelRepo.save(hotel);
  }
}
