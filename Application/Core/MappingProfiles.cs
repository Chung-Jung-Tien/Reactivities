using Application.Activities;
using AutoMapper;
using Domain;
using System.Linq;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(h => h.HostUsername, opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(src => src.AppUser.Bio))
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
        } 
    }
}